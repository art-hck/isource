import { Component, ElementRef, forwardRef, HostBinding, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'uxg-radio-item',
  templateUrl: 'uxg-radio-item.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UxgRadioItemComponent),
    multi: true
  }]
})

export class UxgRadioItemComponent implements ControlValueAccessor {
  @HostBinding('attr.disabled')
  @Input() disabled = false;
  @Input() value = null;
  @Input() name;
  @Input() formControlName;
  @ViewChild('radio', { static: false }) el: ElementRef;
  public onTouched: (value) => void;
  public onChange: (value) => void;
  mainValue = null;

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  writeValue(value): void {
    this.mainValue = value;
  }

  select(e) {
    if (this.disabled !== false) { return; }
    this.el.nativeElement.click();
    e.preventDefault();
    e.stopPropagation();
    this.writeValue(this.value);
  }
}
