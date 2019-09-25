import { Component, OnInit, ViewChild } from '@angular/core';
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestViewComponent } from 'src/app/request/common/components/request-view/request-view.component';
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { OffersService } from "../../services/offers.service";
import { RequestDocument } from "../../../common/models/request-document";
import {ContragentList} from "../../../../contragent/models/contragent-list";
import * as moment from "moment";
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-offers',
  templateUrl: './add-offers.component.html',
  styleUrls: ['./add-offers.component.css']
})
export class AddOffersComponent implements OnInit {
  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[] = [];
  suppliers: string[] = [];

  showAddContragentModal = false;
  resetContragentForm = false;

  showAddOfferModal = false;
  offerForm: FormGroup;

  showOfferModal = false;
  showImportOffersExcel = false;

  selectedRequestPosition: RequestPosition;
  selectedSupplier: string;
  selectedOffer: RequestOfferPosition;

  selectedRequestPositions: RequestPosition[] = [];

  contragents: ContragentList[];
  contragentForm: FormGroup;
  showContragentInfo = false;
  selectedContragent: ContragentList;

  files: File[] = [];

  @ViewChild(RequestViewComponent, {static: false})
  requestView: RequestViewComponent;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private formBuilder: FormBuilder,
    protected offersService: OffersService,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.offerForm = this.formBuilder.group({
      priceWithVat: ['', [Validators.required, Validators.min(1)]],
      currency: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      measureUnit: ['', Validators.required],
      deliveryDate: ['', [Validators.required, CustomValidators.futureDate()]],
      paymentTerms: ['', Validators.required]
    });

    this.updateRequestInfo();
    this.updatePositionsAndSuppliers();
  }

  getSupplierLinkedOffers(
    linkedOffers: RequestOfferPosition[],
    supplier: string
  ): RequestOfferPosition[] {
    return linkedOffers.filter(function(item) { return item.supplierContragentName === supplier; });
  }

  onSelectedContragent(contragent: ContragentList) {
    this.selectedContragent = contragent;
  }

  onShowContragentInfo($event) {
    this.showContragentInfo = $event;
  }

  // Модальное окно выбора контрагента

  onShowAddContragentModal() {
    this.showAddContragentModal = true;
    if (this.contragentForm) {
      this.contragentForm.valueChanges.subscribe(data => {
        this.showContragentInfo = false;
      });
    }
  }

  onCloseAddContragentModal() {
    this.showAddContragentModal = false;
    this.resetContragentForm = true;
    this.showContragentInfo = false;
  }

  onAddContragent() {
    this.suppliers.push(this.selectedContragent.shortName);
    this.suppliers.sort();
    this.onCloseAddContragentModal();
  }

  // Модальное окно создание КП
  onShowAddOfferModal(requestPosition: RequestPosition, supplier: string) {
    this.selectedRequestPosition = requestPosition;
    this.selectedSupplier = supplier;

    this.showAddOfferModal = true;

    this.offerForm.get('quantity').setValue(requestPosition.quantity);
    this.offerForm.get('measureUnit').setValue(requestPosition.measureUnit);
    this.offerForm.get('paymentTerms').setValue(requestPosition.paymentTerms);
    if (requestPosition.deliveryDate !== null) {
      const deliveryDate = requestPosition.deliveryDate ?
        moment(new Date(requestPosition.deliveryDate)).format('DD.MM.YYYY') :
        requestPosition.deliveryDate;
      this.offerForm.get('deliveryDate').patchValue(deliveryDate);
    }
  }

  isFieldValid(field: string) {
    return this.offerForm.get(field).errors
      && (this.offerForm.get(field).touched || this.offerForm.get(field).dirty);
  }

  onAddOffer() {
    const formValue = this.offerForm.value;
    formValue.supplierContragentName = this.selectedSupplier;

    this.offersService.addOffer(this.requestId, this.selectedRequestPosition.id, formValue).subscribe(
      (data: RequestOfferPosition) => {
        this.selectedRequestPosition.linkedOffers.push(data);
      }
    );
    this.onCloseAddOfferModal();
  }

  onCloseAddOfferModal() {
    this.showAddOfferModal = false;
    this.offerForm.reset();
  }

  // Модальное окно просмотра КП
  onShowOfferModal(offer: RequestOfferPosition) {
    this.selectedOffer = offer;

    this.showOfferModal = true;
  }

  onUploadDocuments(files: File[], offer: RequestOfferPosition) {
    this.offersService.uploadDocuments(offer, files)
      .subscribe((documents: RequestDocument[]) => {
        documents.forEach(document => offer.documents.push(document));
      });
  }

  onUploadTechnicalProposals(files: File[], offer: RequestOfferPosition) {
    this.offersService.uploadTechnicalProposals(offer, files)
      .subscribe((documents: RequestDocument[]) => {
        documents.forEach(document => offer.technicalProposals.push(document));
      });
  }

  onRequestsClick() {
    this.router.navigateByUrl(`requests/back-office`);
  }

  onRequestClick() {
    this.router.navigateByUrl(`requests/back-office/${this.request.id}`);
  }

  onDownloadOffersTemplate() {
    this.offersService.downloadOffersTemplate(this.request);
  }

  onSelectPosition(requestPosition: RequestPosition) {
    const index = this.selectedRequestPositions.indexOf(requestPosition);

    if (index === -1) {
      this.selectedRequestPositions.push(requestPosition);
    } else {
      this.selectedRequestPositions.splice(index, 1);
    }
  }

  onPublishOffers() {
    this.offersService.publishRequestOffers(this.requestId, this.selectedRequestPositions).subscribe(
      () => {
        this.updatePositionsAndSuppliers();
        this.selectedRequestPositions = [];
      }
    );
  }

  onShowImportOffersExcel(): void {
    this.showImportOffersExcel = true;
  }

  onChangeFilesList(files: File[]): void {
    this.files = files;
  }

  onSendOffersTemplateFilesClick(): void {
    this.offersService.addOffersFromExcel(this.request, this.files).subscribe((data: any) => {
      Swal.fire({
        width: 400,
        html: '<p class="text-alert">' + 'Шаблон импортирован</br></br>' + '</p>' +
          '<button id="submit" class="btn btn-primary">' +
          'ОК' + '</button>',
        showConfirmButton: false,
        onBeforeOpen: () => {
          const content = Swal.getContent();
          const $ = content.querySelector.bind(content);

          const submit = $('#submit');
          submit.addEventListener('click', () => {
            this.updatePositionsAndSuppliers();
            this.files = [];
            this.showImportOffersExcel = false;
            Swal.close();
          });
        }
      });
    }, (error: any) => {
      let msg = 'Ошибка в шаблоне';
      if (error && error.error && error.error.detail) {
        msg = `${msg}: ${error.error.detail}`;
      }
      alert(msg);
    });
  }

  protected updatePositionsAndSuppliers(): void {
    this.requestService.getRequestPositionsWithOffers(this.requestId).subscribe(
      (data: any) => {
        this.requestPositions = data.positions;
        this.suppliers = data.suppliers;
      }
    );
  }

  protected updateRequestInfo() {
    this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        this.request = request;
      }
    );
  }
}
