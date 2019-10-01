import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import { Request } from "../../../common/models/request";
import { RequestPosition } from "../../../common/models/request-position";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestViewComponent } from 'src/app/request/common/components/request-view/request-view.component';
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { CustomValidators } from "../../../../shared/forms/custom.validators";
import { OffersService } from "../../services/offers.service";
import { RequestDocument } from "../../../common/models/request-document";
import {ContragentList} from "../../../../contragent/models/contragent-list";
import {ContragentService} from "../../../../contragent/services/contragent.service";
import * as moment from "moment";
import Swal from "sweetalert2";
import {ClrWizard} from "@clr/angular";
import {isBoolean} from "util";
import {PaginatorComponent} from "../../../../order/components/paginator/paginator.component";
import {ProcedureService} from "../../services/procedure.service";
import {NotificationService} from "../../../../shared/services/notification.service";

@Component({
  selector: 'app-add-offers',
  templateUrl: './add-offers.component.html',
  styleUrls: ['./add-offers.component.css']
})
export class AddOffersComponent implements OnInit {
  @ViewChild(RequestViewComponent, {static: false})
  requestView: RequestViewComponent;

  requestId: Uuid;
  request: Request;
  requestPositions: RequestPosition[] = [];
  suppliers: string[] = [];

  showAddContragentModal = false;
  showContragentList = false;

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
  procedureBasicDataForm: any;
  procedurePropertiesForm: any;
  showContragentInfo = false;
  selectedContragent: ContragentList;

  procedureInfo: any;
  procedureProperties: any;
  selectedProcedurePositions: RequestPosition[] = [];

  files: File[] = [];

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
      paymentTerms: ['', Validators.required]
    });

    this.contragentForm = this.formBuilder.group({
      searchContragent: [null, Validators.required]
    });

    this.procedurePropertiesForm = this.formBuilder.group({
      manualEndRegistration: [false],
      positionsRequiredAll: [false],
      positionsEntireVolume: [false],
      positionsAnalogs: [false],
      positionsAllowAnalogsOnly: [false],
      prolongateEndRegistration: [null, Validators.min(1)],
      positionsSuppliersVisibility: ['NameHidden'],
      positionsBestPriceType: ['LowerStartPrice'],
      positionsApplicsVisibility: ['PriceAndRating']
    });

    this.initProcedureBasicDataForm();

    this.updateRequestInfo();
    this.updatePositionsAndSuppliers();
    this.getContragentList();
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

  isDataFieldValid(field: string) {
    return this.procedureBasicDataForm.get(field).errors
      && (this.procedureBasicDataForm.get(field).touched
        || this.procedureBasicDataForm.get(field).dirty);
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

  onPublishProcedure() {
    this.procedureInfo = this.procedureBasicDataForm.value;
    this.procedureProperties = this.procedurePropertiesForm.value;
    this.procedureService.publishProcedure(this.requestId,
      this.procedureInfo, this.procedureProperties, this.selectedProcedurePositions).subscribe(
      () => {
        this.resetWizardForm();
        this.notificationService.toast('Процедура успешно создана');
      }
    );
    this.wizard.reset();
    this.procedureBasicDataForm.reset();
    this.procedurePropertiesForm.reset();
  }

  resetWizardForm() {
    this.wizard.reset();
    this.procedureBasicDataForm.reset();
    this.procedurePropertiesForm.reset();
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
        this.initProcedureBasicDataForm();
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
