import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { KimPriceOrderPosition } from "../../../../common/models/kim-price-order-position";
import { Uuid } from "../../../../../cart/models/uuid";
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-kim-price-order-form-positions',
  templateUrl: './form-positions.component.html',
  styleUrls: ['./form-positions.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => KimPriceOrderFormPositionsComponent), multi: true }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KimPriceOrderFormPositionsComponent implements ControlValueAccessor, AfterViewInit {
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
    this.formArray = this.fb.array((this.value || [null]).map(p => this.getFormPosition(p)), Validators.required);
    this.cd.markForCheck();
  }

  getFormPosition(position?: KimPriceOrderPosition): FormGroup {
    const form = this.fb.group({
      controlId: Guid.create().toString(),
      name: [null, Validators.required],
      okpd2: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1), Validators.pattern(/\d+/)]],
      okei: [null, Validators.required],
    });
    form.patchValue(position || {});
    return form;
  }

  submit() {
    const value: (KimPriceOrderPosition & {controlId: Uuid})[] = this.formArray.value.reduce((positions, position) => {
      const i = (this.value || []).findIndex(({controlId}) => position.controlId === controlId);
      positions.push({...(this.value || [])[i], ...position});
      return positions;
    }, []);

    this.writeValue(value);

    if (this.onChange) {
      this.onChange(value);
    }

    this.cancel.emit();
  }
}
