import { AfterContentInit, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { startWith } from "rxjs/operators";
import { ProcedureAction } from "../../../models/procedure-action";

@Component({
  selector: 'app-request-procedure-create-properties',
  templateUrl: './procedure-create-properties.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProcedureCreatePropertiesComponent),
    multi: true
  }]
})
export class ProcedureCreatePropertiesComponent implements AfterContentInit, ControlValueAccessor {
  @Input() action: ProcedureAction["action"] = "create";
  @Input() publicAccess = true;
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
      positionsApplicsVisibility: this.default("positionsApplicsVisibility", 'PriceAndRating'),
      publicAccess: this.default("publicAccess", this.publicAccess)
    });

    if (this.action === 'bargain') {
      ['positionsRequiredAll', 'positionsAnalogs', 'positionsAllowAnalogsOnly', 'positionsEntireVolume', 'publicAccess']
        .forEach(k => this.form.get(k).disable());
    }

    if (!this.publicAccess) {
      this.form.get('publicAccess').disable();
    }

    this.form.get('positionsAnalogs').valueChanges
      .pipe(startWith(<{}>this.form.get('positionsAnalogs').value)).subscribe(value => {
        const c = this.form.get('positionsAllowAnalogsOnly');
        value ? c.enable() : c.disable();
        c.setValue(false);
      });

    this.form.valueChanges.pipe(startWith(<{}>this.form.getRawValue())).subscribe(() => {
      this.writeValue(this.form.getRawValue());
      this.onChange(this.form.getRawValue());
    });
  }

  default = (k, v) => (this.value && this.value[k]) === null ? v : this.value[k];
  registerOnChange = (fn: any) => this.onChange = fn;
  registerOnTouched = (fn: any) => this.onTouched = fn;
  writeValue = (value) => this.value = value;
}
