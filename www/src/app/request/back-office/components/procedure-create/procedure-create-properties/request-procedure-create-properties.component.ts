import { AfterContentInit, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { startWith } from "rxjs/operators";

@Component({
  selector: 'app-request-procedure-create-properties',
  templateUrl: './request-procedure-create-properties.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RequestProcedureCreatePropertiesComponent),
    multi: true
  }]
})
export class RequestProcedureCreatePropertiesComponent implements AfterContentInit, ControlValueAccessor {
  @Input() action: "create" | "prolong" | "bargain" = "create";
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
      ['positionsRequiredAll', 'positionsAnalogs', 'positionsAllowAnalogsOnly', 'positionsEntireVolume']
        .forEach(k => this.form.get(k).disable());
    }

    if (!this.publicAccess) {
      this.form.get('publicAccess').disable();
    }

    this.form.valueChanges.pipe(startWith(<{}>this.form.value)).subscribe(value => {
      this.writeValue(value);
      this.onChange(value);
    });
  }

  default = (k, v) => (this.value && this.value[k]) === null ? v : this.value[k];
  registerOnChange = (fn: any) => this.onChange = fn;
  registerOnTouched = (fn: any) => this.onTouched = fn;
  writeValue = (value) => this.value = value;
}
