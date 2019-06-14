import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import * as moment from "moment";
import {RequestItem} from "../../models/request-item";
import {CreateRequestService} from "../../services/create-request.service";

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {
  requestDataForm: FormGroup;
  item: boolean = false;
  requestItem: RequestItem;

  constructor(private formBuilder: FormBuilder, private createRequestService: CreateRequestService) {
  }

  ngOnInit() {
    this.requestDataForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      productionDocument: ['', [Validators.required]],
      quantity: [null, [Validators.required, Validators.pattern(/^[+]?[1-9]\d*$/)]],
      measureUnit: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required, this.dateMinimum()]],
      isDeliveryAsap: [false],
      deliveryBasis: ['', [Validators.required]],
      paymentTerms: ['30 банковских дней по факту поставки', [Validators.required]],
      startPrice: [null, [Validators.min(1)]],
      currency: [''],
      relatedServices: [''],
      comments: ['']
    });
    this.requestDataForm.get('isDeliveryAsap').valueChanges.subscribe(checked => {
      if (checked) {
        this.requestDataForm.get('deliveryDate').disable();
      } else {
        this.requestDataForm.get('deliveryDate').enable();
      }
    });

  }

  isFieldValid(field: string) {
    return this.requestDataForm.get(field).errors
      && (this.requestDataForm.get(field).touched || this.requestDataForm.get(field).dirty);
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

  onAddRequest() {
    this.requestItem = this.requestDataForm.value;
    return this.createRequestService.addRequest(this.requestItem).subscribe(
      () => {
      }
    );
  }
}
