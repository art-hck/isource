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
import { RequestItem } from "../../models/request-item";
import { CreateRequestService } from "../../services/create-request.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  requestDataForm: FormGroup;
  item = false;
  requestItem: RequestItem;

  get itemForm() {
    return this.requestDataForm.get('itemForm') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private createRequestService: CreateRequestService,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.requestDataForm = this.formBuilder.group({
        'itemForm': this.formBuilder.array([
          this.addItemFormGroup()
        ])
      }
    );
  }

  addItemFormGroup(): FormGroup {
    const itemForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      productionDocument: ['', [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      measureUnit: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required, this.dateMinimum()]],
      isDeliveryDateAsap: [false],
      deliveryBasis: ['', [Validators.required]],
      paymentTerms: ['30 банковских дней по факту поставки', [Validators.required]],
      startPrice: [null, [Validators.min(1)]],
      currency: ['RUB'],
      relatedServices: [''],
      comments: [''],
      documents: [null]
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

  /**
   * Возвращает валидно ли поле в форме
   * @param form
   */
  isFieldInvalid(i, field: string) {
    return this.itemForm.at(i).get(field).errors
      && (this.itemForm.at(i).get(field).touched || this.itemForm.at(i).get(field).dirty);
  }

  /**
   * Возвращает валидны ли поля в форме, которые уже заполнялись пользователем
   * @param form
   */
  isInvalidForm(form) {
    let isInvalid = false;
    Object.keys(form.controls).forEach(key => {
      isInvalid = isInvalid
        || (form.get(key).invalid && (form.get(key).touched || form.get(key).dirty));
    });
    return isInvalid;
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

  onAddNext() {
    this.itemForm.push(this.addItemFormGroup());
  }

  deleteItem(i): void {
    this.itemForm.removeAt(i);
  }

  onAddRequest() {
    this.requestItem = this.requestDataForm.value;
    return this.createRequestService.addRequest(this.requestItem['itemForm']).subscribe(
      (data: any) => {
        this.router.navigateByUrl(`requests/customer/${data.id}`);
      }
    );
  }

  onDocumentSelected(documents: File[], form: FormGroup) {
    form.get('documents').setValue(documents);
  }

  onSendExcelFile(files: File[]): void {
    this.createRequestService.addRequestFromExcel(files).subscribe((data: any) => {
      this.router.navigateByUrl(`requests/customer/${data.id}`);
    }, (error: any) => {
      let msg = 'Ошибка в шаблоне';
      if (error && error.error && error.error.detail) {
        msg = `${msg}: ${error.error.detail}`;
      }
      alert(msg);
    });
  }
}
