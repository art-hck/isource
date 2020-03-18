import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";

@Component({
  selector: 'app-request-technical-proposals-form-manufacturer',
  templateUrl: './technical-proposal-form-manufacturer.component.html',
  styleUrls: ['technical-proposal-form-manufacturer.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TechnicalProposalFormManufacturerComponent),
    multi: true
  }]
})
export class TechnicalProposalFormManufacturerComponent implements OnInit, ControlValueAccessor {
  @Output() cancel = new EventEmitter();
  @Input() disabledFn: (item) => boolean;
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
      value.map(valueItem => this.formPositions.push(this.createFormGroupPosition(valueItem)));
    }
  }

  createFormGroupPosition({manufacturingName, position}) {
    const form = this.fb.group({
      position: position,
      manufacturingName: [manufacturingName || position.name, Validators.required]
    });

    if (this.disabledFn && this.disabledFn({position})) {
      form.disable();
    }

    return form;
  }

  submit(controls: AbstractControl[]) {
    const value = controls.map(control => control.value);
    this.writeValue(value);
    this.onChange(value);
  }

  get pristineCount() {
    return this.formPositions.controls.filter(c => !c.get('manufacturingName').value).length;
  }
}
