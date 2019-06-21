import { Component, OnInit } from '@angular/core';
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
  countForm: number;
  formTitles = [];

  showForm = [];

  constructor(private formBuilder: FormBuilder, private createRequestService: CreateRequestService) {
  }

  ngOnInit() {

    this.requestDataForm = this.formBuilder.group({
        'itemForm': this.formBuilder.array([
          this.addItemFormGroup()
        ])
    }
    );
this.showForm[0] = true;

    // this.requestDataForm.get('isDeliveryDateAsap').valueChanges.subscribe(checked => {
    //   if (checked) {
    //     this.requestDataForm.get('deliveryDate').disable();
    //   } else {
    //     this.requestDataForm.get('deliveryDate').enable();
    //   }
    // });

  }

  addItemFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      productionDocument: ['', [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      measureUnit: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required, this.dateMinimum()]],
      isDeliveryDateAsap: [false],
      deliveryBasis: ['', [Validators.required]],
      paymentTerms: ['30 банковских дней по факту поставки', [Validators.required]],
      startPrice: [null, [Validators.min(1)]],
      currency: [''],
      relatedServices: [''],
      comments: ['']
    });
  }

  // isFieldValid(field: string) {
  //   return this.requestDataForm.get(field).errors
  //     && (this.requestDataForm.get(field).touched || this.requestDataForm.get(field).dirty);
  // }

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

  onAddToList(i) {
    this.showForm[i] = false;
    this.countForm = i;
   this.formTitles[i] = this.requestDataForm.controls['itemForm'].get('name').value;
   console.log(this.requestDataForm.controls['itemForm'].get('name').value);
  }

  onAddNext() {
    this.showForm[this.countForm + 1] = true;
    const control = <FormArray>this.requestDataForm.controls['itemForm'];
    control.push(this.addItemFormGroup());
  }

  onAddRequest() {
    this.requestItem = this.requestDataForm.value;
    return this.createRequestService.addRequest(this.requestItem).subscribe(
      () => {
      }
    );
  }
}
