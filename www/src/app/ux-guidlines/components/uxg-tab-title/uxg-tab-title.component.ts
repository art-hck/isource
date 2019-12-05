import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input } from '@angular/core';

@Component({
  selector: 'uxg-tab-title',
  templateUrl: './uxg-tab-title.component.html',
})
export class UxgTabTitleComponent {

  @HostBinding('class.app-tabs-item') appTabsItem = true;
  @Input() active = false;
  public onToggle = new EventEmitter<boolean>();

  get right(): number {
    const el = this.el.nativeElement;
    return el.parentElement.offsetWidth - el.offsetWidth - this.left;
  }

  get left(): number {
    return this.el.nativeElement.offsetLeft;
  }

  get disabled() {
    const attr = this.el.nativeElement.getAttribute("disabled");
    return attr !== null && attr !== "false";
  }

  constructor(private el: ElementRef) {}

  @HostListener("click")
  activate() {
    if (!this.active && !this.disabled) {
      this.onToggle.emit(true);
      this.active = true;
    }
  }

  deactivate() {
    if (this.active && !this.disabled) {
      this.onToggle.emit(false);
      this.active = false;
    }
  }
}
