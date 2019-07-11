import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {RequestPosition} from "../../models/request-position";
import {RequestPositionWorkflowStepLabels} from "../../dictionaries/request-position-workflow-step-labels";
import {RequestPositionWorkflowSteps} from "../../enum/request-position-workflow-steps";
import {Uuid} from "../../../../cart/models/uuid";
import {OffersService} from "../../../back-office/services/offers.service";
import {Request} from "../../models/request";
import {RequestService as BackofficeRequestService} from "../../../back-office/services/request.service";
import {RequestService as CustomerRequestService} from "../../../customer/services/request.service";
import {EditRequestService} from "../../services/edit-request.service";
import {Router} from "@angular/router";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import * as moment from "moment";
import {RequestItem} from "../../models/request-item";
import {DocumentsService} from "../../services/documents.service";

@Component({
  selector: 'app-position-info',
  templateUrl: './position-info.component.html',
  styleUrls: ['./position-info.component.css']
})
export class PositionInfoComponent implements OnInit, OnChanges {
  protected _opened = false;

  positionInfoEditable = false;
  positionInfoDataForm: FormGroup;

  @Input()
  set showInfo(val) {
    this._opened = val;
    this.openedChange.emit(val);
  }

  get showInfo() {
    return this._opened;
  }

  @Input() requestPosition: RequestPosition;
  @Input() requestId: Uuid;
  @Input() isCustomerView: boolean;

  // TODO оживить кнопку Закрыть карточку и Закрыть список позиций
  @Output() showPositionList = new EventEmitter<boolean>();
  @Output() openedChange = new EventEmitter<boolean>();

  requestPositionItem: RequestPosition;

  requestPositionWorkflowStepLabels = Object.entries(RequestPositionWorkflowStepLabels);
  offerWinner: Uuid;

  contractForm: FormGroup;

  @Output() updatePositionInfoEvent = new EventEmitter<boolean>();


  constructor(
    private formBuilder: FormBuilder,
    private offersService: OffersService,
    private backofficeRequestService: BackofficeRequestService,
    private editRequestService: EditRequestService,
    private customerRequestService: CustomerRequestService,
    protected router: Router,
    private documentsService: DocumentsService
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.positionInfoDataForm = this.addItemFormGroup();
  }

  ngOnInit() {
    this.contractForm = this.formBuilder.group({
      comments: [''],
      documents: [null]
    });
    this.positionInfoDataForm = this.addItemFormGroup();
  }


  checkIfSelected(val) {
    return (val === this.requestPosition.currency);
  }


  getDeliveryDate(val: any) {
    console.log(val);
    if (!moment(val, 'DD.MM.YYYY', true).isValid()) {
      return moment(val).format('DD.MM.YYYY');
    } else {
      return val;
    }
  }

  changeDeliveryDate(val: any) {
    if (!moment(val, 'DD.MM.YYYY', true).isValid()) {
      this.requestPosition.deliveryDate = val;
    } else {
      this.requestPosition.deliveryDate = moment(val, 'DD.MM.YYYY').format();
    }
  }

  get dateObject() {
    return moment(new Date(this.requestPosition.deliveryDate)).format('DD.MM.YYYY');
  }

  addItemFormGroup(): FormGroup {
    const itemForm = this.formBuilder.group({
      name: [this.requestPosition.name, [Validators.required]],
      productionDocument: [this.requestPosition.productionDocument, [Validators.required]],
      quantity: [this.requestPosition.quantity, [Validators.required, Validators.min(1)]],
      measureUnit: [this.requestPosition.measureUnit, [Validators.required]],
      deliveryDate: [this.requestPosition.deliveryDate ?
        this.requestPosition.deliveryDate :
        ''
        , [Validators.required, this.dateMinimum()]],
      isDeliveryDateAsap: [false],
      deliveryBasis: [this.requestPosition.deliveryBasis, [Validators.required]],
      paymentTerms: [this.requestPosition.paymentTerms, [Validators.required]],
      startPrice: [this.requestPosition.startPrice, [Validators.min(1)]],
      currency: [this.requestPosition.currency],
      relatedServices: [this.requestPosition.relatedServices],
      comments: [this.requestPosition.comments]
    });
    itemForm.get('isDeliveryDateAsap').valueChanges.subscribe(checked => {
      if (checked) {
        itemForm.get('deliveryDate').disable();
      } else {
        itemForm.get('deliveryDate').enable();
      }
    });

    itemForm.updateValueAndValidity();
    itemForm.markAllAsTouched();

    return itemForm;
  }



  isFieldValid(field: string) {
    return this.positionInfoDataForm.get(field).errors
      && (this.positionInfoDataForm.get(field).touched || this.positionInfoDataForm.get(field).dirty);
  }

  dateMinimum(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlDate = moment(control.value, 'DD.MM.YYYY');
      const validationDate = moment(new Date(), 'DD.MM.YYYY');

      return controlDate.isAfter(validationDate) ? null : {
        'date-minimum': {
          'date-minimum': validationDate,
          'actual': controlDate.format('DD.MM.YYYY')
        }
      };
    };
  }


  onSavePositionInfo() {
    this.requestPositionItem = this.positionInfoDataForm.value;

    return this.editRequestService.saveRequest(this.requestPosition.id, this.requestPositionItem).subscribe(
      (data: any) => {
        this.updatePositionInfoEvent.emit();
        this.positionInfoEditable = false;
        this.requestPosition = this.requestPositionItem;
      }
    );
  }



  onPublishOffers(requestPosition: RequestPosition) {
    this.offersService.publishOffers(this.requestId, requestPosition.id).subscribe(
      (data: any) => {
        requestPosition.status = data.status;
        requestPosition.statusLabel = data.statusLabel;
      }
    );
  }

  canPublish(requestPosition: RequestPosition) {
    return (requestPosition.status === RequestPositionWorkflowSteps.PROPOSALS_PREPARATION
      || requestPosition.status === RequestPositionWorkflowSteps.NEW) && (requestPosition.linkedOffers.length !== 0)
      && !this.isCustomerView;
  }

  canChoiceWinner(requestPosition: RequestPosition) {
    return requestPosition.status === RequestPositionWorkflowSteps.RESULTS_AGREEMENT && this.isCustomerView;
  }

  getOfferWinner(offerWinner: Uuid) {
    this.offerWinner = offerWinner;
  }

  onChoiceWinner(requestPosition: RequestPosition) {
    this.customerRequestService.choiceWinner(this.offerWinner, requestPosition.id, this.requestId).subscribe(
      (data: any) => {
        requestPosition.status = data.status;
        requestPosition.statusLabel = data.statusLabel;
      }
    );
  }

  onChangeStatus(requestPosition: RequestPosition, newStatus: string) {
    this.backofficeRequestService.changeStatus(this.requestId, requestPosition.id, newStatus).subscribe(
      (data: any) => {
        requestPosition.status = data.status;
        requestPosition.statusLabel = data.statusLabel;
        if (data.requestStatus !== null) {
          this.backofficeRequestService.getRequestInfo(this.requestId).subscribe(
            (request: Request) => {}
          );
        }
      });
  }

  canDownloadContract(requestPosition: RequestPosition) {
    return requestPosition.status === RequestPositionWorkflowSteps.WINNER_SELECTED
      || requestPosition.status === RequestPositionWorkflowSteps.CONTRACT_SIGNING;

  }

}
