import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Contract } from "../../models/contract";
import { getCurrencySymbol } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import moment from "moment";
import { StateStatus } from "../../models/state-status";
import { AppFile } from "../../../../shared/components/file/file";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { Store } from "@ngxs/store";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Certificate, createDetachedSignature, getUserCertificates } from "crypto-pro";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestDocument } from "../../models/request-document";
import { UxgModalComponent } from "uxg";
import { CertificateInfoModel } from "../../../../contract-sign/models/certificate-info.model";

@Component({
  selector: 'app-contract-list-item',
  templateUrl: './contract-list-item.component.html',
  styleUrls: ['./contract-list-item.component.scss']
})
export class ContractListItemComponent implements OnChanges {
  @ViewChild('signDocumentModal') signDocumentModal: UxgModalComponent;
  @ViewChild('certificatesListModal') certificatesListModal: UxgModalComponent;

  @Input() contract: Contract;
  @Input() status: StateStatus;
  @Input() rollbackDuration: number;
  @Input() rollbackDate: string;
  @Output() send = new EventEmitter<{ comment?: string, files: File[] }>();
  @Output() rollback = new EventEmitter();
  @Output() approve = new EventEmitter();
  @Output() reject = new EventEmitter<{ comment?: string, files: File[] }>();
  @Output() download = new EventEmitter();
  @Output() sign = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() openDocumentSignModal = new EventEmitter();
  @Output() signDocument = new EventEmitter();

  readonly certForm: FormGroup = this.fb.group({
    thumbprint: [null, Validators.required]
  });
  certificates: {
    data: any,
    ownerInfo: any,
    issuerInfo: any,
    serialNumber: string,
  }[];
  certificateListError: string = null;
  contractId: Uuid;
  documentsToSign: RequestDocument[];

  folded: boolean;
  files: File[];
  historyFolded = true;
  historyFoldedLength = 3;

  readonly getCurrencySymbol = getCurrencySymbol;
  readonly form = this.fb.group({ comment: "", files: null });

  get total(): number {
    return this.contract?.winners.reduce((total, { offerPosition: p }) => total += (p.priceWithoutVat * p.quantity), 0);
  }

  get canRollback(): boolean {
    return this.rollback.observers.length && ['ON_APPROVAL'].includes(this.contract.status) && moment().diff(moment(this.rollbackDate), 'seconds') < this.rollbackDuration;
  }

  get canSend(): boolean { return this.send.observers.length && ['NEW', 'REJECTED'].includes(this.contract.status); }
  get canReject(): boolean { return this.reject.observers.length && ['ON_APPROVAL'].includes(this.contract.status); }
  get canApprove(): boolean { return this.approve.observers.length && ['ON_APPROVAL'].includes(this.contract.status); }
  get canSign(): boolean { return this.sign.observers.length && ['APPROVED'].includes(this.contract.status); }
  get canDelete(): boolean { return this.delete.observers.length && ['NEW'].includes(this.contract.status); }
  get signedByCustomer(): boolean { return ['SIGNED_BY_CUSTOMER'].includes(this.contract.status); }
  get signedBySupplier(): boolean { return ['SIGNED_BY_SUPPLIER'].includes(this.contract.status); }

  constructor(
    private fb: FormBuilder,
    private store: Store,
    public user: UserInfoService,
  ) {}

  selectFiles(files: File[]) {
    this.files = files;
    this.form.get('files').setValue(this.files.map(f => new AppFile(f)).filter(({ valid }) => valid).map(({ file }) => file));
  }

  openSignDocumentModal(contract, documents) {
    this.contract = contract;
    this.contractId = contract.id;
    this.documentsToSign = documents;
    this.signDocumentModal.open();
  }

  openCertificatesListModal() {
    this.signDocumentModal.close();
    this.certificatesListModal.open();
    this.getCertificatesList().then(r => {});
  }

  copyContractSignLink() {
    // todo перенести функциональность в отдельную директиву

    const linkToGo = window.location.origin + '/contracts-sign/' + this.contract.id;

    if (typeof(navigator.clipboard) === 'undefined') {
      const textArea = document.createElement("textarea");
      textArea.value = linkToGo;
      textArea.style.position = "fixed";  // avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const copied = document.execCommand('copy');
        if (copied) {
          this.store.dispatch(new ToastActions.Success("Ссылка успешно скопирована"));
        } else {
          this.store.dispatch(new ToastActions.Error('Не удалось скопировать ссылку'));
        }
      } catch (err) {
        this.store.dispatch(new ToastActions.Error('Не удалось скопировать ссылку: ' + err.error.detail));
      }

      document.body.removeChild(textArea);
    } else {
      navigator.clipboard.writeText(linkToGo).then(() => {
        this.store.dispatch(new ToastActions.Success("Ссылка успешно скопирована"));
      })
        .catch(err => {
          this.store.dispatch(new ToastActions.Error('Не удалось скопировать ссылку: ' + err.error.detail));
        });
    }
  }

  async onSignDocument() {
    if (this.certForm.valid) {
      const requestId = this.contract.request.id;
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

            this.signDocument.emit({data, requestId});
          }
        });
      });
    }
  }

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

  // todo Перенести в общий компонент
  prepareDataForSubjectOrIssue(certificate: Certificate) {
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

  ngOnChanges() {
    this.form.get('files').setValidators(this.canSend ? Validators.required : null);
  }
}

