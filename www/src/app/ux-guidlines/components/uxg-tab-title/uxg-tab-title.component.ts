import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input } from '@angular/core';

@Component({
  selector: 'uxg-tab-title',
  templateUrl: './uxg-tab-title.component.html'
})
export class UxgTabTitleComponent {

  @HostBinding('class') appTabsItem = 'app-tabs-item';
  @Input() active = false;

  get right(): number {
    return this.el.nativeElement.parentElement.offsetWidth - this.el.nativeElement.offsetWidth - this.left;
  }

  get left(): number {
    return this.el.nativeElement.offsetLeft;
  }

  constructor(private el: ElementRef) {}

  public onClick = new EventEmitter();

  @HostListener("click") click() {
    if (!this.active) {
      this.onClick.emit();
      this.active = true;
    }
  }
}
