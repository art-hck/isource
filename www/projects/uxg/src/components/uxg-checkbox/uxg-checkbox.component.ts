import { Component, ElementRef, forwardRef, HostBinding, Input, ViewChild } from '@angular/core';
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
  @HostBinding('attr.disabled')
  @Input() disabled: boolean;

  @Input() isMixed: boolean;
  @ViewChild('checkbox', { static: false }) el: ElementRef;

  registerOnChange = (fn: any) => this.onChange = fn;
  registerOnTouched = (fn: any) => this.onTouched = fn;
  setDisabledState = (disabled: boolean) => this.disabled = disabled;
  writeValue = (value: boolean | null) => this.value = value;

  check(ev) {
    if (this.disabled) { return; }

    this.el.nativeElement.checked = !this.el.nativeElement.checked;
    ev.preventDefault();
    ev.stopPropagation();

    if (this.onChange) {
      this.onChange(this.el.nativeElement.checked);
    }
    this.writeValue(this.el.nativeElement.checked);
  }

  asHTMLInputElement(el) {
    return el as HTMLInputElement;
  }
}
