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
import {ContragentService} from "../../../../contragent/services/contragent.service";
import * as moment from "moment";
import Swal from "sweetalert2";
import {DocumentsService} from "../../../common/services/documents.service";

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
  showContragentList = false;

  showAddOfferModal = false;
  editMode = false;
  offerForm: FormGroup;

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
    protected router: Router,
    private getContragentService: ContragentService,
    private documentsService: DocumentsService
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
      paymentTerms: ['', Validators.required],
      id: [''],
      documents: [[]]
    });

    this.contragentForm = this.formBuilder.group({
      searchContragent: [null, Validators.required]
    });

    this.updateRequestInfo();
    this.updatePositionsAndSuppliers();
    this.getContragentList();
  }

  getSupplierLinkedOffers(
    linkedOffers: RequestOfferPosition[],
    supplier: string
  ): RequestOfferPosition[] {
    return linkedOffers.filter(function(item) { return item.supplierContragentName === supplier; });
  }

  getContragentList(): void {
    this.getContragentService.getContragentList().subscribe(
      (data: ContragentList[]) => {
        this.contragents = data;
      });
  }

  // Модальное окно выбора контрагента
  onShowContragentList() {
    this.showContragentList = !this.showContragentList;
  }

  onShowAddContragentModal() {
    this.showAddContragentModal = true;
    this.getContragentList();
    this.contragentForm.valueChanges.subscribe(data => {
      this.showContragentInfo = false;
    });
  }

  onCloseAddContragentModal() {
    this.showAddContragentModal = false;
    this.contragentForm.reset();
    this.showContragentInfo = false;
  }

  onAddContragent() {
    this.suppliers.push(this.selectedContragent.shortName);
    this.suppliers.sort();
    this.onCloseAddContragentModal();
  }

  selectContragent(contragent: ContragentList) {
    this.contragentForm.patchValue({"searchContragent": contragent.shortName});
    this.showContragentList = false;
    this.selectedContragent = contragent;
    this.showContragentInfo = true;
  }

  getSearchValue() {
    return this.contragentForm.value.searchContragent;
  }

  // Модальное окно создание КП
  onShowAddOfferModal(requestPosition: RequestPosition, supplier: string) {
    this.selectedRequestPosition = requestPosition;
    this.selectedSupplier = supplier;
    this.showAddOfferModal = true;
    this.files = [];
    this.addOfferValues(requestPosition);
  }

  onShowEditOfferModal(requestPosition: RequestPosition, supplier: string, linkedOffer: RequestOfferPosition) {
    this.selectedRequestPosition = requestPosition;
    this.selectedSupplier = supplier;
    this.selectedOffer = linkedOffer;
    this.showAddOfferModal = true;
    this.editMode = true;
    this.setOfferValues(linkedOffer);
  }

  setOfferValues(linkedOffer: RequestOfferPosition) {
    this.offerForm.get('priceWithVat').setValue(linkedOffer.priceWithoutVat);
    this.offerForm.get('currency').setValue(linkedOffer.currency);
    this.offerForm.get('quantity').setValue(linkedOffer.quantity);
    this.offerForm.get('measureUnit').setValue(linkedOffer.measureUnit);
    this.offerForm.get('paymentTerms').setValue(linkedOffer.paymentTerms);
    this.offerForm.get('id').setValue(linkedOffer.id);
    const deliveryDate = linkedOffer.deliveryDate ?
      moment(new Date(linkedOffer.deliveryDate)).format('DD.MM.YYYY') :
      linkedOffer.deliveryDate;
    this.offerForm.get('deliveryDate').patchValue(deliveryDate);
    this.offerForm.get('documents').setValue(linkedOffer.documents);
  }

  addOfferValues(requestPosition) {
    this.offerForm.get('quantity').setValue(requestPosition.quantity);
    this.offerForm.get('measureUnit').setValue(requestPosition.measureUnit);
    this.offerForm.get('paymentTerms').setValue(requestPosition.paymentTerms);
    if (requestPosition.deliveryDate !== null) {
      const deliveryDate = requestPosition.deliveryDate ?
        moment(new Date(requestPosition.deliveryDate)).format('DD.MM.YYYY') :
        requestPosition.deliveryDate;
      this.offerForm.get('deliveryDate').patchValue(deliveryDate);
      this.offerForm.get('documents').setValue(requestPosition.documents);
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
    this.files = [];
  }

  onEditOffer() {
    const formValue = this.offerForm.value;
    formValue.supplierContragentName = this.selectedSupplier;

    this.offersService.editOffer(this.requestId, this.selectedRequestPosition.id, formValue).subscribe(
      (data: RequestOfferPosition) => {
        this.updatePositions();
      }
    );
    this.onCloseAddOfferModal();
    this.files = [];
  }

  onCloseAddOfferModal() {
    this.showAddOfferModal = false;
    this.offerForm.reset();
    this.editMode = false;
  }

  onDownloadFile(document: RequestDocument) {
    this.documentsService.downloadFile(document);
  }

  onUploadDocuments(files: File[], offer: RequestOfferPosition) {
    this.offersService.uploadDocuments(offer, files)
      .subscribe((documents: RequestDocument[]) => {
        documents.forEach(document => offer.documents.push(document));
      });
  }

  onDocumentSelected(documents: File[], form) {
    form.get('documents').setValue(documents);
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

  protected updatePositions(): void {
    this.requestService.getRequestPositionsWithOffers(this.requestId).subscribe(
      (data: any) => {
        this.requestPositions = data.positions;
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
