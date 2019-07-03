import {Component, OnInit} from '@angular/core';
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
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {

  requestDataForm: FormGroup;
  item = false;
  requestItem: RequestItem;
  countForm: number;

  showForm = [];
  editForm = false;
  showAddToList = true;

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
    this.showForm[0] = true;
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

  isFieldValid(i, field: string) {
    return this.itemForm.at(i).get(field).errors
      && (this.itemForm.at(i).get(field).touched || this.itemForm.at(i).get(field).dirty);
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

  onAddToList(i) {
    this.showForm[i] = false;
    this.countForm = i;
  }

  onAddNext() {
    this.showForm[this.countForm + 1] = true;
    this.showAddToList = true;
    this.itemForm.push(this.addItemFormGroup());
  }

  onEditForm(i) {
    for (let k = 0; k < this.showForm.length; k++) {
      this.showForm[k] = false;
    }
    this.showForm[i] = true;
    this.editForm = true;
    this.showAddToList = false;
  }

  onAddRequest() {
    this.requestItem = this.requestDataForm.value;
    return this.createRequestService.addRequest(this.requestItem['itemForm']).subscribe(
      (data: any) => {
        this.router.navigateByUrl(`requests/customer/${data.id}`);
      }
    );
  }

  // Отображаем кнопку Добавить только если все формы свернуты или раскрыта форма для редактирования
  canAddItems() {
    if (this.editForm) {
      return false;
    }
    for (let i = 0; i < this.showForm.length; i++) {
      if (this.showForm[i] === true) {
        return false;
      }
    }
    return true;
  }

  deleteItem(i): void {
    this.itemForm.removeAt(i);
  }

  onDocumentSelected(documents: File[], form: FormGroup) {
    form.get('documents').setValue(documents);
  }
}
