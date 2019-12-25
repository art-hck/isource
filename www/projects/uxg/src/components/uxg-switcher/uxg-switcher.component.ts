import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'uxg-switcher',
  templateUrl: './uxg-switcher.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UxgSwitcherComponent),
    multi: true
  }]
})
export class UxgSwitcherComponent implements ControlValueAccessor {
  public value: boolean;
  public onTouched: (value: boolean) => void;
  public onChange: (value: boolean) => void;
  @Input() disabled: boolean;

  @Input() isMixed: boolean;
  @Input() label: string;
  @Input() labelAlign: "left" | "right" = "left";

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  writeValue(value: boolean | null): void {
    this.value = value;
  }

  switch(ev, el) {
    el.click();
    ev.preventDefault();
    ev.stopPropagation();
    this.writeValue(el.checked);
  }
}
