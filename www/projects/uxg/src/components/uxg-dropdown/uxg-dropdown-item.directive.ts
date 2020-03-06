import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input } from '@angular/core';
import { UxgDropdownItemData } from "./uxg-dropdown-item-data";

@Directive({
  selector: '[uxgDropdownItem]'
})
export class UxgDropdownItemDirective {
  @HostBinding('class.app-dropdown-items-item') classItem = true;
  @Input() disabled = false;
  @Input() value = null;
  @Input() displayValue = null;

  onSelect = new EventEmitter<UxgDropdownItemData>();

  get label(): string | null {
    return this.el.nativeElement.innerText || null;
  }

  constructor(private el: ElementRef) {}

  @HostListener('click')
  click() {
    if (this.disabled === false) {
      this.onSelect.emit({value: this.value, label: this.label, displayValue: this.displayValue});
    }
  }
}
