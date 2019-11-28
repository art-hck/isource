import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'uxg-checkbox',
  templateUrl: 'uxg-checkbox.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UxgCheckboxComponent),
    multi: true
  }]
})

export class UxgCheckboxComponent {
  public value: boolean;
  public onTouched: (value: boolean) => void;
  public onChange: (value: boolean) => void;
  public isDisabled: boolean;

  @Input() isMixed: boolean;

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(value: boolean | null): void {
    this.value = value;
  }

  check(ev, el) {
    el.click();
    ev.preventDefault();
    ev.stopPropagation();
  }

}
