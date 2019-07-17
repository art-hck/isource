import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
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

@Component({
  selector: 'app-create-request-form',
  templateUrl: './create-request-form.component.html',
  styleUrls: ['./create-request-form.component.css']
})
export class CreateRequestFormComponent implements OnInit, AfterViewInit, AfterViewChecked {

  requestDataForm: FormGroup;
  // тут храним список открытых форм
  formShow = [];

  @Output() submit = new EventEmitter<any>();

  get itemForm() {
    return this.requestDataForm.get('itemForm') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.formShow[0] = false;
    this.requestDataForm = this.formBuilder.group({
        'itemForm': this.formBuilder.array([
          this.addItemFormGroup()
        ])
      }
    );
  }

  ngAfterViewChecked() {
    // костыль, чтобы не валилась ошибка в консоль
    this.cdRef.detectChanges();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.expandForm(0);
  }

  expandForm(i): void {
    setTimeout(() => {
      this.formShow[i] = true;
    });
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
      documents: [[]]
    });
    itemForm.get('isDeliveryDateAsap').valueChanges.subscribe(checked => {
      itemForm.get('deliveryDate').reset();
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
   * @param i
   * @param field
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

    const newFormIndex = this.itemForm.controls.length - 1;

    // закрываем все вкладки
    this.formShow.forEach(function(item, i, arr) {
      arr[i] = false;
    });

    this.expandForm(newFormIndex);
  }

  deleteItem(i): void {
    this.formShow.splice(i, 1);
    this.itemForm.removeAt(i);
  }

  onSubmit() {
    this.submit.emit(this.requestDataForm.value);
  }

  onDocumentSelected(documents: File[], form) {
    form.get('documents').setValue(documents);
  }
}
