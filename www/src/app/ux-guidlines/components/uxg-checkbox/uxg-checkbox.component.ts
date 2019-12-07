import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'uxg-checkbox',
  templateUrl: 'uxg-checkbox.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UxgCheckboxComponent),
    multi: true
  }]
})

export class UxgCheckboxComponent implements ControlValueAccessor {
  public value: boolean;
  public onTouched: (value: boolean) => void;
  public onChange: (value: boolean) => void;
  public isDisabled: boolean;

  @Input() isMixed: boolean;
  @ViewChild('checkbox', { static: false }) el: ElementRef;

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

  check(ev) {
    this.el.nativeElement.click();
    ev.preventDefault();
    ev.stopPropagation();
    this.writeValue(this.el.nativeElement.checked);
  }

}
