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

  get label(): string | null {
    return this.el.nativeElement.innerText || null;
  }

  constructor(private el: ElementRef) {}

  @HostListener('click')
  click() {
    if (this.disabled === false) {
      this.onSelect.emit(this.value);
    }
  }
}
