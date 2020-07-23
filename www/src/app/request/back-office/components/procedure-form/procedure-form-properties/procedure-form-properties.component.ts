import { AfterContentInit, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { startWith } from "rxjs/operators";
import { ProcedureAction } from "../../../models/procedure-action";

@Component({
  selector: 'app-request-procedure-form-properties',
  templateUrl: './procedure-form-properties.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProcedureFormPropertiesComponent),
    multi: true
  }]
})
export class ProcedureFormPropertiesComponent implements AfterContentInit, ControlValueAccessor {
  @Input() action: ProcedureAction["action"] = "create";
  @Output() publicAccessChange = new EventEmitter();
  public onTouched: (value) => void;
  public onChange: (value) => void;
  public form: FormGroup;
  public value;

  constructor(private fb: FormBuilder) {}

  ngAfterContentInit() {
    this.form = this.fb.group({
      manualEndRegistration: this.default("manualEndRegistration", false),
      positionsRequiredAll: this.default("positionsRequiredAll", false),
      positionsAnalogs: this.default("positionsAnalogs", false),
      positionsAllowAnalogsOnly: this.default("positionsAllowAnalogsOnly", false),
      positionsEntireVolume: this.default("positionsEntireVolume", false),
      positionsSuppliersVisibility: this.default("positionsSuppliersVisibility", 'NameHidden'),
      positionsBestPriceType: this.default("positionsBestPriceType", 'LowerStartPrice'),
      positionsApplicsVisibility: this.default("positionsApplicsVisibility", 'PriceAndRating')
    });

    if (this.action === 'bargain') {
      ['positionsRequiredAll', 'positionsAnalogs', 'positionsAllowAnalogsOnly', 'positionsEntireVolume']
        .forEach(k => this.form.get(k).disable());

      this.form.addControl('bestPriceRequirements', this.fb.control(this.default("bestPriceRequirements", false)));
    }

    let analogsValueChanges$ = this.form.get('positionsAnalogs').valueChanges;

    if (this.action !== 'bargain') {
      analogsValueChanges$ = analogsValueChanges$.pipe(startWith(<{}>this.form.get('positionsAnalogs').value));
    }
    analogsValueChanges$.subscribe(value => {
      const c = this.form.get('positionsAllowAnalogsOnly');

      if (value) {
        c.enable();
      } else {
        c.disable();
        c.setValue(false);
      }
    });

    this.form.valueChanges.pipe(startWith({})).subscribe(() => {
      this.writeValue(this.form.getRawValue());
      this.onChange(this.form.getRawValue());
    });
  }

  default = (k, v) => this.value?.[k] ?? v;
  registerOnChange = fn => this.onChange = fn;
  registerOnTouched = fn => this.onTouched = fn;
  writeValue = value => this.value = value;
}
