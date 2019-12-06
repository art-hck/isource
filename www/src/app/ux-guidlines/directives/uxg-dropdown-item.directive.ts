import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[uxgDropdownItem]'
})
export class UxgDropdownItemDirective {
  @HostBinding('class.app-dropdown-items-item') classItem = true;
  @Input() disabled = false;
  @Input() value = null;

  onSelect = new EventEmitter();

  constructor(private el: ElementRef) {}

  @HostListener('click')
  click() {
    if (this.disabled === false) {
      this.onSelect.emit({
        value: this.value || this.el.nativeElement.innerText,
        label: this.el.nativeElement.innerText
      });
    }
  }
}
