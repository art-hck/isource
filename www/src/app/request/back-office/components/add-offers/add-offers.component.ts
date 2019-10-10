import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { OffersService } from "../../services/offers.service";
import { RequestDocument } from "../../../common/models/request-document";
import {ContragentList} from "../../../../contragent/models/contragent-list";
import * as moment from "moment";
import Swal from "sweetalert2";
import {ClrWizard} from "@clr/angular";
import {isBoolean} from "util";
import {PaginatorComponent} from "../../../../order/components/paginator/paginator.component";
import {ProcedureService} from "../../services/procedure.service";
import {NotificationService} from "../../../../shared/services/notification.service";
import {DocumentsService} from "../../../common/services/documents.service";
import { SupplierSelectComponent } from "../supplier-select/supplier-select.component";
import { ContragentService } from "../../../../contragent/services/contragent.service";

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

  showAddOfferModal = false;
  editMode = false;
  offerForm: FormGroup;

  showImportOffersExcel = false;

  selectedRequestPosition: RequestPosition;
  selectedSupplier: string;
  selectedOffer: RequestOfferPosition;
  offerFiles: File[] = [];

  selectedRequestPositions: RequestPosition[] = [];

  contragents: ContragentList[];
  procedureBasicDataForm: any;
  procedurePropertiesForm: any;
  selectedContragent: ContragentList;

  procedureInfo: any;
  procedureProperties: any;
  selectedProcedurePositions: RequestPosition[] = [];
  selectedProcedureDocuments: RequestDocument[] = [];
  selectedProcedureLotDocuments: RequestDocument[] = [];

  showPrivateAccessContragents = false;
  contragentsWithTp: ContragentList[] = [];
  selectedPrivateAccessContragents: ContragentList[] = [];

  files: File[] = [];

  @ViewChild(SupplierSelectComponent, { static: false }) supplierSelectComponent: SupplierSelectComponent;
  @ViewChild("wizard", { static: false }) wizard: ClrWizard;
  _open = false;

  open() {
    this._open = !this.open;
  }

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private formBuilder: FormBuilder,
    protected offersService: OffersService,
    protected router: Router,
    private getContragentService: ContragentService,
    private documentsService: DocumentsService,
    private procedureService: ProcedureService
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

    this.procedurePropertiesForm = this.formBuilder.group({
      manualEndRegistration: [false],
      positionsRequiredAll: [false],
      positionsEntireVolume: [false],
      positionsAnalogs: [false],
      positionsAllowAnalogsOnly: [false],
      prolongateEndRegistration: [10, Validators.min(1)],
      positionsSuppliersVisibility: ['NameHidden'],
      positionsBestPriceType: ['LowerStartPrice'],
      positionsApplicsVisibility: ['PriceAndRating']
    });

    this.initProcedureBasicDataForm();

    this.updateRequestInfo();
    this.updatePositionsAndSuppliers();
  }

  initProcedureBasicDataForm() {
    this.procedureBasicDataForm = this.formBuilder.group({
      procedureTitle: ['', Validators.required],
      dishonestSuppliersForbidden: [false],
      dateEndRegistration: ['', [Validators.required, CustomValidators.futureDate]],
      summingupDate: ['', [Validators.required, CustomValidators.customDate('dateEndRegistration')]],
      positions: this.formBuilder.array(this.requestPositions.map(element => {
        return this.formBuilder.control(false);
      }))
    });

    this.procedureBasicDataForm.get('summingupDate').disable();
    this.procedureBasicDataForm.get('dateEndRegistration').valueChanges.subscribe(value => {
      if (value) {
        this.procedureBasicDataForm.get('summingupDate').enable();
      } else {
        this.procedureBasicDataForm.get('summingupDate').disable();
      }
    });
  }

  get positionsArray() {
    return <FormArray>this.procedureBasicDataForm.get('positions');
  }

  getSelectedPositions() {
    this.selectedProcedurePositions = [];
    this.positionsArray.controls.forEach((control, i) => {
      if (control.value) {
        this.selectedProcedurePositions.push(this.requestPositions[i]);
      }
    });
  }

  onSelectProcedureDocument(document: RequestDocument) {
    const index = this.selectedProcedureDocuments.indexOf(document);

    if (index === -1) {
      this.selectedProcedureDocuments.push(document);
    } else {
      this.selectedProcedureDocuments.splice(index, 1);
    }
  }

  onSelectProcedureLotDocument(document: RequestDocument) {
    const index = this.selectedProcedureLotDocuments.indexOf(document);

    if (index === -1) {
      this.selectedProcedureLotDocuments.push(document);
    } else {
      this.selectedProcedureLotDocuments.splice(index, 1);
    }
  }

  isDataFieldValid(field: string) {
    return this.procedureBasicDataForm.get(field).errors
      && (this.procedureBasicDataForm.get(field).touched
        || this.procedureBasicDataForm.get(field).dirty);
  }

  isDocumentsExists(positions: RequestPosition[]): boolean {
    for (const position of positions) {
      if (position.documents.length) {
        return true;
      }
    }

    return false;
  }

  getSupplierLinkedOffers(
    linkedOffers: RequestOfferPosition[],
    supplier: string
  ): RequestOfferPosition[] {
    return linkedOffers.filter(function(item) { return item.supplierContragentName === supplier; });
  }

  onSelectedContragent(contragent: ContragentList) {
    this.selectedContragent = contragent;
    this.isSupplierOfferExist();
  }

  isSupplierOfferExist() {
    return this.suppliers.indexOf(this.selectedContragent.shortName) !== -1;
  }

  onShowAddContragentModal() {
    this.showAddContragentModal = true;
    this.supplierSelectComponent.resetSearchFilter();
  }

  onCloseAddContragentModal() {
    this.showAddContragentModal = false;
    this.supplierSelectComponent.resetSearchFilter();
    this.selectedContragent = null;
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
    this.offerFiles = [];
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
    this.offerFiles = [];
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
    this.offerFiles = [];
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
    this.router.navigateByUrl(`requests/backoffice`);
  }

  onRequestClick() {
    this.router.navigateByUrl(`requests/backoffice/${this.request.id}`);
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

  onSelectAllPositions(event, requestPositions: RequestPosition[]): void {
    if (event.target.checked === true) {
      this.selectedRequestPositions = [];
      requestPositions.forEach(requestPosition => {
        if (requestPosition.linkedOffers.length !== 0) {
          requestPosition.checked = true;
          this.selectedRequestPositions.push(requestPosition);
        }
      });
    } else {
      this.selectedRequestPositions = [];

      requestPositions.forEach(requestPosition => {
        if (requestPosition.linkedOffers.length !== 0) {
          requestPosition.checked = null;
        }
      });
    }
  }

  areAllPositionsChecked(requestPositions: RequestPosition[]): boolean {
    return !requestPositions.some(
      requestPosition => requestPosition.linkedOffers.length !== 0 && requestPosition.checked !== true
    );
  }

  onPublishOffers() {
    this.offersService.publishRequestOffers(this.requestId, this.selectedRequestPositions).subscribe(
      () => {
        this.updatePositionsAndSuppliers();
        this.selectedRequestPositions = [];
      }
    );
  }

  onPublishProcedure() {
    this.procedureInfo = this.procedureBasicDataForm.value;
    this.procedureProperties = this.procedurePropertiesForm.value;
    this.procedureService.publishProcedure(
      this.requestId,
      this.procedureInfo,
      this.procedureProperties,
      this.selectedProcedurePositions,
      this.selectedProcedureDocuments,
      this.selectedProcedureLotDocuments,
      this.selectedPrivateAccessContragents
    ).subscribe(
      (data: any) => {
        this.resetWizardForm();
        Swal.fire({
          width: 400,
          html: '<p class="text-alert">Процедура ' + '<a href="' + data.procedureUrl + '" target="_blank">' +
            data.procedureId + '</a> успешно создана</br></br></p>' +
            '<button id="submit" class="btn btn-primary">ОК</button>',
          showConfirmButton: false,
          onBeforeOpen: () => {
            const content = Swal.getContent();
            const $ = content.querySelector.bind(content);

            const submit = $('#submit');
            submit.addEventListener('click', () => {
              Swal.close();
            });
          }
        });
      },
      (error: any) => {
        let msg = 'Ошибка при создании процедуры';
        if (error && error.error && error.error.detail) {
          msg = `${msg}: ${error.error.detail}`;
        }
        alert(msg);
      }
    );
  }

  resetWizardForm() {
    this.wizard.reset();
    this.procedureBasicDataForm.reset();
    this.procedurePropertiesForm.reset();

    this.selectedProcedurePositions = [];
    this.selectedProcedureDocuments = [];
    this.selectedProcedureLotDocuments = [];
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

  onHidePrivateAccessContragents(): void {
    this.showPrivateAccessContragents = false;
  }

  onShowPrivateAccessContragents(): void {
    this.offersService.getContragentsWithTp(this.request, this.selectedProcedurePositions).subscribe(
      (contragents: ContragentList[]) => {
        this.contragentsWithTp = contragents;
      }
    );
    this.showPrivateAccessContragents = true;
  }

  onSelectPrivateAccessContragent(contragent: ContragentList): void {
    const index = this.selectedPrivateAccessContragents.indexOf(contragent);

    if (index === -1) {
      this.selectedPrivateAccessContragents.push(contragent);
    } else {
      this.selectedPrivateAccessContragents.splice(index, 1);
    }
  }

  protected updatePositionsAndSuppliers(): void {
    this.requestService.getRequestPositionsWithOffers(this.requestId).subscribe(
      (data: any) => {
        this.requestPositions = data.positions;
        this.suppliers = data.suppliers;
        this.initProcedureBasicDataForm();
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
