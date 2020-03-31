import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { KimPriceOrderPosition } from "../../../../common/models/kim-price-order-position";
import { Uuid } from "../../../../../cart/models/uuid";

@Component({
  selector: 'app-kim-price-order-form-positions-params',
  templateUrl: './form-positions-params.component.html',
  styleUrls: ['./form-positions-params.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => KimPriceOrderFormPositionsParamsComponent), multi: true }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KimPriceOrderFormPositionsParamsComponent implements ControlValueAccessor, AfterViewInit {
  @Output() cancel = new EventEmitter();
  formArray: FormArray;
  value?: (KimPriceOrderPosition & {controlId: Uuid})[];
  onTouched: (value) => void;
  onChange: (value) => void;
  registerOnChange = (fn: any) => this.onChange = fn;
  registerOnTouched = (fn: any) => this.onTouched = fn;
  writeValue = (value) => this.value = value;
  asFormGroup = (abstractControl: AbstractControl) => abstractControl as FormGroup;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.formArray = this.fb.array((this.value || [null]).map(p => this.getFormPosition(p)));
    this.cd.markForCheck();
  }

  getFormPosition(position?: KimPriceOrderPosition): FormGroup {
    const form = this.fb.group({
      controlId: [null],
      maxPrice: [null, [Validators.min(1), Validators.pattern(/^\d+$/)]],
      comment: [null]
    });
    form.patchValue(position || {});
    return form;
  }

  submit() {
    const value = this.value.map((item) => ({...item, ...this.formArray.value.find(({controlId}) => controlId === item.controlId)}));

    this.writeValue(value);

    if (this.onChange) {
      this.onChange(value);
    }

    this.cancel.emit();
  }
}
