import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
import { ProcedureService } from "../../services/procedure.service";
import { NotificationService } from "../../../../shared/services/notification.service";
import { DocumentsService } from "../../../common/services/documents.service";
import { SupplierSelectComponent } from "../supplier-select/supplier-select.component";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { ContragentInfo } from "../../../../contragent/models/contragent-info";
import { GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { APP_CONFIG } from '@stdlib-ng/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { PublishProcedureInfo } from '../../models/publish-procedure-info';
import { PublishProcedureResult } from '../../models/publish-procedure-result';
import { PublishProcedureRequest } from '../../models/publish-procedure-request';
import { ProcedureBasicDataPage } from '../../models/procedure-basic-data-page';
import { WizardCreateProcedureComponent } from '../wizard-create-procedure/wizard-create-procedure.component';

@Component({
  selector: 'app-add-offers',
  templateUrl: './add-offers.component.html',
  styleUrls: ['./add-offers.component.css']
})
export class AddOffersComponent implements OnInit {
  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[] = [];
  requestPositions$: Observable<RequestPosition[]>;
  suppliers: ContragentList[] = [];

  showAddContragentModal = false;

  showAddOfferModal = false;
  editMode = false;
  offerForm: FormGroup;

  showImportOffersExcel = false;

  contragent: ContragentInfo;
  contragentInfoModalOpened = false;

  selectedRequestPosition: RequestPosition;
  selectedSupplierId: Uuid;
  selectedOffer: RequestOfferPosition;
  offerFiles: File[] = [];

  selectedRequestPositions: RequestPosition[] = [];

  selectedContragent: ContragentList;

  files: File[] = [];

  appConfig: GpnmarketConfigInterface;

  @ViewChild(SupplierSelectComponent, {static: false}) supplierSelectComponent: SupplierSelectComponent;
  @ViewChild('searchPositionInput', { static: false }) searchPositionInput: ElementRef;
  @ViewChild("createProcedureWizard", {static: false}) wizard: WizardCreateProcedureComponent;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private formBuilder: FormBuilder,
    protected offersService: OffersService,
    protected router: Router,
    private getContragentService: ContragentService,
    private documentsService: DocumentsService,
    private procedureService: ProcedureService,
    private notificationService: NotificationService,
    @Inject(APP_CONFIG) appConfig: GpnmarketConfigInterface
  ) {
    this.appConfig = appConfig;
  }

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    const getRequestInfoSubscription = this.requestService.getRequestInfo(this.requestId).subscribe(
      (request: Request) => {
        getRequestInfoSubscription.unsubscribe();
        this.request = request;
      }
    );

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

    this.updatePositionsAndSuppliers();
  }

  showContragentInfo(event: MouseEvent, contragentId: Uuid): void {
    // При клике не даём открыться ссылке из href, вместо этого показываем модальное окно
    event.preventDefault();

    this.contragentInfoModalOpened = true;

    if (!this.contragent || this.contragent.id !== contragentId) {
      this.contragent = null;

      const subscription = this.getContragentService
        .getContragentInfo(contragentId)
        .subscribe(contragentInfo => {
          this.contragent = contragentInfo;
          subscription.unsubscribe();
        });
    }
  }

  getSupplierLinkedOffers(
    linkedOffers: RequestOfferPosition[],
    supplier: ContragentList
  ): RequestOfferPosition[] {
    return linkedOffers.filter(function (item) {
      return item.supplierContragentName === supplier.shortName;
    });
  }

  onSelectedContragent(contragent: ContragentList) {
    this.selectedContragent = contragent;
    this.isSupplierOfferExist(); // TODO: 2019-11-06 Убрать, если не получится найти смысл этого вызова
  }

  isSupplierOfferExist(): boolean {
    return this.suppliers.indexOf(this.selectedContragent) !== -1;
  }

  positionCanBeSelected(requestPosition: RequestPosition): boolean {
    return (requestPosition.linkedOffers.length !== 0 && !this.positionIsSentForAgreement(requestPosition));
  }

  positionIsSentForAgreement(requestPosition: RequestPosition): boolean {
    return requestPosition.status === RequestPositionWorkflowSteps.RESULTS_AGREEMENT;
  }

  positionHasProcedure(requestPosition: RequestPosition): boolean {
    return requestPosition.hasProcedure;
  }

  positionHasFinishedProcedure(requestPosition: RequestPosition): boolean {
    return requestPosition.procedureEndDate && !requestPosition.hasProcedure;
  }

  onShowAddContragentModal(): void {
    this.showAddContragentModal = true;
    this.supplierSelectComponent.resetSearchFilter();
  }

  onCloseAddContragentModal(): void {
    this.showAddContragentModal = false;
    this.supplierSelectComponent.resetSearchFilter();
    this.selectedContragent = null;
  }

  onAddContragent(): void {
    this.suppliers.push(this.selectedContragent);
    this.onCloseAddContragentModal();

    this.suppliers = this.suppliers.sort((prev, next) => {
      if (prev.shortName < next.shortName) {
        return -1;
      } else if (prev.shortName > next.shortName) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  // Модальное окно создание КП
  onShowAddOfferModal(requestPosition: RequestPosition, supplier: ContragentList): void {
    this.selectedRequestPosition = requestPosition;
    this.selectedSupplierId = supplier.id;
    this.showAddOfferModal = true;
    this.offerFiles = [];
    this.addOfferValues(requestPosition);
  }

  onShowEditOfferModal(requestPosition: RequestPosition, supplier: ContragentList, linkedOffer: RequestOfferPosition): void {
    this.selectedRequestPosition = requestPosition;
    this.selectedSupplierId = supplier.id;
    this.selectedOffer = linkedOffer;
    this.showAddOfferModal = true;
    this.editMode = true;
    this.setOfferValues(linkedOffer);
  }

  setOfferValues(linkedOffer: RequestOfferPosition): void {
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

  addOfferValues(requestPosition: RequestPosition): void {
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

  isFieldValid(field: string): boolean {
    return this.offerForm.get(field).errors
      && (this.offerForm.get(field).touched || this.offerForm.get(field).dirty);
  }

  isOfferClickable(requestPosition: RequestPosition): boolean {
    return !this.positionIsSentForAgreement(requestPosition);
  }

  onAddOffer(): void {
    const formValue = this.offerForm.value;
    formValue.supplierContragentId = this.selectedSupplierId;

    this.offersService.addOffer(this.requestId, this.selectedRequestPosition.id, formValue).subscribe(
      (data: RequestOfferPosition) => {
        this.selectedRequestPosition.linkedOffers.push(data);
      }
    );
    this.onCloseAddOfferModal();
    this.offerFiles = [];
  }

  onEditOffer(): void {
    const formValue = this.offerForm.value;
    formValue.supplierContragentId = this.selectedSupplierId;

    this.offersService.editOffer(this.requestId, this.selectedRequestPosition.id, formValue).subscribe(
      () => {
        this.updatePositions();
      }
    );
    this.onCloseAddOfferModal();
    this.offerFiles = [];
  }

  onCloseAddOfferModal(): void {
    this.showAddOfferModal = false;
    this.editMode = false;
  }

  onDownloadFile(document: RequestDocument): void {
    this.documentsService.downloadFile(document);
  }

  onUploadDocuments(files: File[], offer: RequestOfferPosition): void {
    const subscription = this.offersService.uploadDocuments(offer, files)
      .subscribe((documents: RequestDocument[]) => {
        documents.forEach(document => offer.documents.push(document));
      });
  }

  onDocumentSelected(documents: File[], form): void {
    // TODO: 2019-11-06 Определить тип аргумента form
    form.get('documents').setValue(documents);
  }

  onDownloadOffersTemplate(): void {
    this.offersService.downloadOffersTemplate(this.request);
  }

  onSelectPosition(requestPosition: RequestPosition): void {
    const index = this.selectedRequestPositions.indexOf(requestPosition);

    if (index === -1) {
      this.selectedRequestPositions.push(requestPosition);
    } else {
      this.selectedRequestPositions.splice(index, 1);
    }
  }

  onSelectAllPositions(event, requestPositions: RequestPosition[]): void {
    // TODO: 2019-11-06 Указать тип аргумента event
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

  onPublishOffers(): void {
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

  onPublishProcedure(data: PublishProcedureInfo): void {
    const request: PublishProcedureRequest = {
      procedureInfo: data,
      getTPFilesOnImport: false
    };

    this.procedureService.publishProcedure(request).subscribe(
      (data: PublishProcedureResult) => {
        this.wizard.resetWizardForm();
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

  getProcedureLink(requestPosition: RequestPosition): string {
    const procedureUrl = this.appConfig.procedure.url;
    const id = requestPosition.procedureId;

    return procedureUrl + id;
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

  onCreateProcedureWizardOpen(): void {
    this.wizard.open();
    this.wizard.setContragentLoader((procedureBasicDataPage: ProcedureBasicDataPage) => {
      return this.offersService.getContragentsWithTp(
        this.request,
        procedureBasicDataPage.selectedProcedurePositions
      );
    });
  }

  protected updatePositionsAndSuppliers(): void {
    const requestPositionsWithOffersData = this.requestService.getRequestPositionsWithOffers(this.requestId);
    this.requestPositions$ = requestPositionsWithOffersData.pipe(pluck('positions'));
    const subscription = requestPositionsWithOffersData.subscribe(
      (data: any) => {
        this.requestPositions = data.positions;
        this.suppliers = data.suppliers;
        subscription.unsubscribe();
      }
    );
  }

  protected updatePositions(): void {
    const requestPositionsWithOffersData = this.requestService.getRequestPositionsWithOffers(this.requestId);
    this.requestPositions$ = requestPositionsWithOffersData.pipe(pluck('positions'));
    const subscription = requestPositionsWithOffersData.subscribe(
      (data: any) => {
        this.requestPositions = data.positions;
        subscription.unsubscribe();
      }
    );
  }
}
