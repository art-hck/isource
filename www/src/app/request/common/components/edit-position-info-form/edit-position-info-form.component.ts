import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RequestPosition} from "../../models/request-position";
import {OffersService} from "../../../back-office/services/offers.service";
import {EditRequestService} from "../../services/edit-request.service";
import {Router, ActivatedRoute} from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import * as moment from "moment";
import { CreateRequestService } from '../../services/create-request.service';
import { Uuid } from 'src/app/cart/models/uuid';
import { RequestSavingType } from '../../enum/request-saving-type';

@Component({
  selector: 'app-edit-position-info-form',
  templateUrl: './edit-position-info-form.component.html',
  styleUrls: ['./edit-position-info-form.component.css']
})
export class EditPositionInfoFormComponent implements OnInit {

  positionInfoDataForm: FormGroup;
  requestPositionItem: RequestPosition;
  requestId: Uuid;

  @Input() requestPosition: RequestPosition;
  @Input() isCustomerView: boolean;

  @Output() positionInfoEditable = new EventEmitter<boolean>();
  @Output() changePositionInfo = new EventEmitter<boolean>();
  @Output() updatedRequestPositionItem = new EventEmitter<RequestPosition>();
  @Output() createdNewPosition = new EventEmitter<Uuid>();

  constructor(
    private formBuilder: FormBuilder,
    private offersService: OffersService,
    private editRequestService: EditRequestService,
    protected router: Router,
    protected createRequestService: CreateRequestService,
    protected route: ActivatedRoute
  ) { }


  ngOnInit() {
    this.positionInfoDataForm = this.addItemFormGroup();
    this.requestId = this.route.snapshot.paramMap.get('id');
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

  checkIfSelected(val) {
    return (val === this.requestPosition.currency);
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

    return itemForm;
  }

  isFieldValid(field: string) {
    return this.positionInfoDataForm.get(field).errors
      && (this.positionInfoDataForm.get(field).touched || this.positionInfoDataForm.get(field).dirty);
  }

  onSavePositionInfo() {
    if (typeof this.requestPosition.id !== 'string') {
      this.saveNewPosition();
      return;
    }
    this.saveExistsPosition();
  }

  protected saveExistsPosition(): void {
    this.requestPositionItem = this.positionInfoDataForm.value;
    this.editRequestService.saveRequest(this.requestPosition.id, this.requestPositionItem).subscribe(
      () => {
        this.afterSavePosition(RequestSavingType.EXISTS, this.requestPositionItem.id);
      }
    );
  }

  protected saveNewPosition(): void {
    this.requestPositionItem = this.positionInfoDataForm.value;
    const dataForm = this.formBuilder.group({
      'itemForm': this.formBuilder.array([
        this.positionInfoDataForm
      ])
    });
    const requestItem = dataForm.value;
    this.createRequestService.addRequestPosition(this.requestId, requestItem['itemForm']).subscribe(
      (ids) => {
        if (!(ids && ids.length > 0 && ids[0].id)) {
          alert('Ошибка сохранения новой позиции');
          return;
        }
        const id = ids[0].id;
        this.afterSavePosition(RequestSavingType.NEW, id);
      },
      () => {
        alert('Ошибка сохранения новой позиции');
      }
    );
  }

  /**
   * @param type
   * @param updatedPositionId Идентификатор позиции
   */
  protected afterSavePosition(type: RequestSavingType, updatedPositionId: Uuid): void {
    this.changePositionInfo.emit();
    this.positionInfoEditable.emit(false);

    if (this.requestPositionItem.deliveryDate) {
      this.requestPositionItem.deliveryDate = moment(this.requestPositionItem.deliveryDate, 'DD.MM.YYYY').format();
    }

    this.requestPosition = Object.assign({}, this.requestPosition, this.requestPositionItem);
    this.updatedRequestPositionItem.emit(this.requestPosition);

    if (type === RequestSavingType.NEW) {
      this.createdNewPosition.emit(updatedPositionId);
    }
  }

}
