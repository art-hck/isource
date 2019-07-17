import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RequestPosition} from "../../models/request-position";
import {OffersService} from "../../../back-office/services/offers.service";
import {EditRequestService} from "../../services/edit-request.service";
import {Router} from "@angular/router";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import * as moment from "moment";
import {CustomValidators} from "../../../../shared/forms/custom.validators";

@Component({
  selector: 'app-edit-position-info-form',
  templateUrl: './edit-position-info-form.component.html',
  styleUrls: ['./edit-position-info-form.component.css']
})
export class EditPositionInfoFormComponent implements OnInit {

  positionInfoDataForm: FormGroup;
  requestPositionItem: RequestPosition;

  @Input() requestPosition: RequestPosition;
  @Input() isCustomerView: boolean;

  @Output() positionInfoEditable = new EventEmitter<boolean>();
  @Output() updatePositionInfoEvent = new EventEmitter<boolean>();
  @Output() updatedRequestPositionItem = new EventEmitter<RequestPosition>();

  constructor(
    private formBuilder: FormBuilder,
    private offersService: OffersService,
    private editRequestService: EditRequestService,
    protected router: Router
  ) { }


  ngOnInit() {
    this.positionInfoDataForm = this.addItemFormGroup();
  }

  dateMinimum(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (control.value === '') {
        return null;
      }

      const controlDate = moment(control.value, 'DD.MM.YYYY');
      const validationDate = moment(new Date(), 'DD.MM.YYYY');

      return controlDate.isAfter(validationDate) ? null : {
        'date-minimum': {
          'date-minimum': validationDate.format('DD.MM.YYYY'),
          'actual': controlDate.format('DD.MM.YYYY')
        }
      };
    };
  }

  checkIfSelected(val) {
    return (val === this.requestPosition.currency);
  }

  get dateObject() {
    if (this.requestPosition.deliveryDate) {
      return moment(new Date(this.requestPosition.deliveryDate)).format('DD.MM.YYYY');
    } else {
      return moment(new Date()).format('DD.MM.YYYY');
    }
  }
  set dateObject(val) {
    if (!moment(val, 'DD.MM.YYYY', true).isValid()) {
      this.requestPosition.deliveryDate = val;
    } else {
      this.requestPosition.deliveryDate = moment(val, 'DD.MM.YYYY').format();
    }
  }

  addItemFormGroup(): FormGroup {
    const itemForm = this.formBuilder.group({
      name: [this.requestPosition.name, [Validators.required]],
      productionDocument: [this.requestPosition.productionDocument, [Validators.required]],
      quantity: [this.requestPosition.quantity, [Validators.required, Validators.min(1)]],
      measureUnit: [this.requestPosition.measureUnit, [Validators.required]],
      deliveryDate: [this.requestPosition.deliveryDate, [Validators.required, this.dateMinimum()]],
      isDeliveryDateAsap: [this.requestPosition.isDeliveryDateAsap],
      deliveryBasis: [this.requestPosition.deliveryBasis, [Validators.required]],
      paymentTerms: [this.requestPosition.paymentTerms, [Validators.required]],
      startPrice: [this.requestPosition.startPrice, [Validators.min(1)]],
      currency: [this.requestPosition.currency],
      relatedServices: [this.requestPosition.relatedServices],
      comments: [this.requestPosition.comments]
    });

    if (!!itemForm.get('isDeliveryDateAsap').value) {
      itemForm.get('deliveryDate').disable();
    }

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
    this.requestPositionItem = this.positionInfoDataForm.value;
    return this.editRequestService.saveRequest(this.requestPosition.id, this.requestPositionItem).subscribe(
      (data: any) => {
        this.updatePositionInfoEvent.emit();
        this.positionInfoEditable.emit(false);

        if (this.requestPositionItem.deliveryDate) {
          this.requestPositionItem.deliveryDate = moment(this.requestPositionItem.deliveryDate, 'DD.MM.YYYY').format();
        }

        this.requestPosition = Object.assign({}, this.requestPosition, this.requestPositionItem);
        this.updatedRequestPositionItem.emit(this.requestPosition);
      }
    );
  }

}
