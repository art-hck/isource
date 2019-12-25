import { Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { RequestPositionList } from "../../../../common/models/request-position-list";

@Component({
  selector: 'app-request-technical-proposals-create-manufacturer',
  templateUrl: './request-technical-proposals-create-manufacturer.component.html',
  styleUrls: ['../request-technical-proposals-create-positions/request-technical-proposals-create-positions.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RequestTechnicalProposalsCreateManufacturerComponent),
    multi: true
  }]
})
export class RequestTechnicalProposalsCreateManufacturerComponent implements OnInit, ControlValueAccessor {
  @Output() cancel = new EventEmitter();
  public onTouched: (value) => void;
  public onChange: (value) => void;
  public form: FormGroup;
  public value;

  get formPositions() {
    return this.form.get("positions") as FormArray;
  }

  constructor(private fb: FormBuilder) {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      positions: this.fb.array([])
    });
  }

  writeValue(value): void {
    this.value = value;
    if (value) {
      this.formPositions.clear();
      value.map(valueItem => this.formPositions.push(this.createFormGroupPosition(valueItem.position)));
    }
  }

  createFormGroupPosition(position: RequestPositionList) {
    return this.fb.group({
      manufacturer_name: null,
      position: position
    });
  }

  submit(controls: AbstractControl[]) {
    const value = controls.map(control => control.value);
    this.writeValue(value);
    this.onChange(value);
  }

}
