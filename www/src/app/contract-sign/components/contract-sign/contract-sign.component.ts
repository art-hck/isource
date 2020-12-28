import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeUntil, tap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { ContractSignActions } from "../../actions/contract-sign.actions";
import Fetch = ContractSignActions.Fetch;
import { ContractSignState } from "../../states/contract-sign.state";
import { Contract } from "../../../request/common/models/contract";
import { RequestDocument } from "../../../request/common/models/request-document";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UxgBreadcrumbsService, UxgModalComponent } from "uxg";
import { Certificate, createDetachedSignature, getUserCertificates } from "crypto-pro";
import SignDocument = ContractSignActions.SignDocument;
import { Uuid } from "../../../cart/models/uuid";
import { CertificateInfoModel } from "../../models/certificate-info.model";
import { ToastActions } from "../../../shared/actions/toast.actions";

@Component({
  selector: 'app-contract-sign',
  templateUrl: './contract-sign.component.html',
  styleUrls: ['./contract-sign.component.scss']
})

export class ContractSignComponent implements OnInit, OnDestroy {

  @ViewChild('certificatesListModal') certificatesListModal: UxgModalComponent;
  @Select(ContractSignState.contractSignInfo) contractSignInfo$: Observable<Contract>;

  destroy$ = new Subject();
  signerName: string;

  certificates: CertificateInfoModel[];
  certificateListError: string = null;
  contract: Contract;
  contractId: Uuid;
  documentsToSign: RequestDocument[];

  readonly certForm: FormGroup = this.fb.group({
    thumbprint: [null, Validators.required]
  });

  constructor(
    public store: Store,
    private bc: UxgBreadcrumbsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private actions: Actions,
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(({ id }) => {
        this.contractId = id;
        this.store.dispatch(new Fetch(id));
      }),
      takeUntil(this.destroy$)
    ).subscribe();

    this.contractSignInfo$.subscribe(data => {
      const customerInfo = data?.documents[0].documentSignatures.find(signature => signature.contragentId === data.customer.id);

      this.contract = data;
      this.signerName = customerInfo?.ownerName;
      this.documentsToSign = data?.documents;
    });

    this.actions.pipe(
      ofActionCompleted(SignDocument),
      takeUntil(this.destroy$)
    ).subscribe(({result}) => {
      const e = result.error as any;

      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) :
        new ToastActions.Success(`Договор успешно подписан`)
      );

      this.store.dispatch(new Fetch(this.contractId));
    });
  }

  openSignDocumentModal() {
    this.certificatesListModal?.open();
    this.getCertificatesList().then(r => {});
  }

  onSignDocument() {
    if (this.certForm.valid) {
      const thumbprint = this.certForm.get('thumbprint').value;
      const selectedCertificate = this.certificates.find(cert => cert.data.thumbprint === thumbprint);
      const documentSignatures = [];

      let docsSigned = 0;

      this.contract.documents.forEach(document => {
        createDetachedSignature(thumbprint, document.hash).then(response => {
          documentSignatures.push({
            id: document.id,
            signature: response
          });

          docsSigned++;

          if (docsSigned === this.contract.documents.length) {
            const data = {
              certNumber: selectedCertificate.serialNumber,
              certOwnerName: selectedCertificate.ownerInfo['Владелец'],
              certIssuerName: selectedCertificate.issuerInfo['Компания'],
              documentSignatures
            };

            this.store.dispatch(new SignDocument(this.contractId, data));
          }
        });
      });
    }
  }


  // todo Перенести в общий компонент
  private async getCertificatesList() {
    this.certificates = [];
    this.certificateListError = null;

    try {
      await getUserCertificates().then(response => {
        response.forEach(cert => {
          this.certificates.push(this.prepareDataForSubjectOrIssue(cert));
        });
      });
    } catch (error) {
      this.certificateListError = error.message;
    }
  }

  prepareDataForSubjectOrIssue(certificate: Certificate): any {
    const certInfo = {
      data: {},
      ownerInfo: {},
      issuerInfo: {},
      serialNumber: null
    };

    // Получаем серийный номер сертификата
    certificate.getCadesProp("SerialNumber").then(r => {
      certInfo['serialNumber'] = r;
    });

    // Получаем информацию о владельце
    certificate.getOwnerInfo().then(r => {
      r.map(data => {
        certInfo['ownerInfo'][data.title] = data.description;
      });
    });

    // Получаем информацию об издателе сертификата
    certificate.getIssuerInfo().then(r => {
      r.map(data => {
        certInfo['issuerInfo'][data.title] = data.description;
      });
    });

    // Сохраняем основную информацию о сертификате
    certInfo['data'] = certificate;

    return certInfo;
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

