import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {
  requestDataForm: FormGroup;
  item: boolean = false;
  currentDate = moment().format('DD.MM.YYYY');

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.requestDataForm = this.formBuilder.group({
      mtrName: ['', [Validators.required]],
      docs: ['', [Validators.required]],
      count: [null, [Validators.required, Validators.pattern(/^[+]?[1-9]\d*$/)]],
      units: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required, this.dateMinimum()]],
      deliveryAsap: [''],
      deliveryAddress: ['', [Validators.required]],
      termsOfPayment: ['30 банковских дней по факту поставки', [Validators.required]],
      nmc: [null, [Validators.min(1)]],
      currency: [''],
      additionalServices: [''],
      comment: ['']
    });
    this.requestDataForm.get('deliveryAsap').valueChanges.subscribe(checked => {
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

}
