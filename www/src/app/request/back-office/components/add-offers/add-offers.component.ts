import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import { RequestPositionWorkflowSteps } from '../../../common/enum/request-position-workflow-steps';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { OffersService } from "../../services/offers.service";
import { RequestDocument } from "../../../common/models/request-document";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import * as moment from "moment";
import Swal from "sweetalert2";
import { ClrWizard } from "@clr/angular";
import { ProcedureService } from "../../services/procedure.service";
import { NotificationService } from "../../../../shared/services/notification.service";
import { DocumentsService } from "../../../common/services/documents.service";
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
  positionSearchValue = "";

  showPrivateAccessContragents = false;
  contragentsWithTp: ContragentList[] = [];
  selectedPrivateAccessContragents: ContragentList[] = [];

  files: File[] = [];

  @ViewChild(SupplierSelectComponent, { static: false }) supplierSelectComponent: SupplierSelectComponent;
  @ViewChild('searchPositionInput', { static: false }) searchPositionInput: ElementRef;
  @ViewChild("wizard", { static: false }) wizard: ClrWizard;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private formBuilder: FormBuilder,
    protected offersService: OffersService,
    protected router: Router,
    private getContragentService: ContragentService,
    private documentsService: DocumentsService,
    private procedureService: ProcedureService,
    private notificationService: NotificationService
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

  onPositionSelect(requestPosition) {
    if (this.selectedProcedurePositions.indexOf(requestPosition) > -1) {
      for (let i = 0; i < this.selectedProcedurePositions.length; i++) {
        if (this.selectedProcedurePositions[i] === requestPosition) {
          this.selectedProcedurePositions.splice(i, 1);
        }
      }
    } else {
      this.selectedProcedurePositions.push(requestPosition);
    }
  }

  /**
   * Функция проверяет, должна ли быть отмечена позиция в списке в модальном окне
   * @param requestPosition
   */
  checkIfPositionIsChecked(requestPosition: RequestPosition): boolean {
    console.log(this.selectedProcedurePositions);
    return (this.selectedProcedurePositions.indexOf(requestPosition) > -1);
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

  positionCanBeSelected(requestPosition: RequestPosition): boolean {
    return (requestPosition.linkedOffers.length !== 0 && !this.positionIsSentForAgreement(requestPosition));
  }

  positionIsSentForAgreement(requestPosition: RequestPosition): boolean {
    return requestPosition.status === RequestPositionWorkflowSteps.RESULTS_AGREEMENT;
  }

  positionHasProcedure(requestPosition: RequestPosition): boolean {
    return requestPosition.hasProcedure === true;
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
    const deliveryDate = linkedOffer.deliveryDate ?
      moment(new Date(linkedOffer.deliveryDate)).format('DD.MM.YYYY') :
      linkedOffer.deliveryDate;

    this.offerForm.reset();
    this.offerForm.patchValue({
      'id': linkedOffer.id,
      'priceWithVat': linkedOffer.priceWithoutVat,
      'currency': linkedOffer.currency,
      'quantity': linkedOffer.quantity,
      'measureUnit': linkedOffer.measureUnit,
      'paymentTerms': linkedOffer.paymentTerms,
      'deliveryDate': deliveryDate,
    });
  }

  addOfferValues(requestPosition: RequestPosition) {
    this.offerForm.reset();
    this.offerForm.patchValue({
      'currency': requestPosition.currency,
      'quantity': requestPosition.quantity,
      'measureUnit': requestPosition.measureUnit,
      'paymentTerms': requestPosition.paymentTerms,
    });
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

  isOfferClickable(requestPosition: RequestPosition): boolean {
    return !this.positionIsSentForAgreement(requestPosition);
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
      () => {
        this.updatePositions();
      }
    );
    this.onCloseAddOfferModal();
    this.offerFiles = [];
  }

  onCloseAddOfferModal() {
    this.showAddOfferModal = false;
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

  positionHasSelectableOffers(requestPositions: RequestPosition[]): boolean {
    return requestPositions.some(requestPosition => this.positionCanBeSelected(requestPosition));
  }

  onPublishOffers() {
    let alertWidth = 340;
    let htmlTemplate = '<p class="text-alert warning-msg">Отправить на согласование?</p>' +
      '<button id="submit" class="btn btn-primary">Да, отправить</button>' +
      '<button id="cancel" class="btn btn-link">Отменить</button>';

    if (this.selectedRequestPositions.some(requestPosition => requestPosition.hasProcedure === true)) {
      alertWidth = 500;
      htmlTemplate = '<p class="text-alert warning-msg">' +
        'Процедура сбора коммерческих предложений по позиции ещё не завершена. ' +
        '<br>' +
        'Вы уверены, что хотите отправить созданные предложения на согласование заказчику?</p>' +
        '<button id="submit" class="btn btn-primary">Да, отправить</button>' +
        '<button id="cancel" class="btn btn-link">Отменить</button>';
    }

    Swal.fire({
      width: alertWidth,
      html: htmlTemplate,
      showConfirmButton: false,

      onBeforeOpen: () => {
        const content = Swal.getContent();
        const $ = content.querySelector.bind(content);

        const submit = $('#submit');
        const cancel = $('#cancel');

        submit.addEventListener('click', () => {
          this.offersService.publishRequestOffers(this.requestId, this.selectedRequestPositions).subscribe(
            () => {
              this.updatePositionsAndSuppliers();
              this.selectedRequestPositions = [];
            }
          );
          Swal.close();
        });
        cancel.addEventListener('click', () => {
          Swal.close();
        });
      }
    });

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
        this.updatePositionsAndSuppliers();
        this.selectedRequestPositions = [];
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

  getPositionSearchValue() {
    if (this.searchPositionInput) {
      return this.searchPositionInput.nativeElement.value;
    }
    return this.positionSearchValue;
  }

  onPositionSearchInputChange(value) {
    this.positionSearchValue = value;
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

  onImportOffersFromProcedure(): void {
    this.procedureService.importOffersFromProcedure(this.request).subscribe(
      (offers: RequestOfferPosition[]) => {
        if (offers.length) {
          this.updatePositionsAndSuppliers();
          this.notificationService.toast('КП загружены');
        } else {
          this.notificationService.toast('Нет новых КП');
        }
      }, (error: any) => {
        let msg = 'Ошибка';
        if (error && error.error && error.error.detail) {
          msg = `${msg}: ${error.error.detail}`;
        }
        alert(msg);
      }
    );
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
