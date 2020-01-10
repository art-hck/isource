import { Component, ElementRef, EventEmitter, HostBinding, HostListener } from "@angular/core";

@Component({
  selector: 'uxg-popover',
  template: `<ng-content></ng-content>`
})
export class UxgPopoverComponent {
  public changeState = new EventEmitter<boolean>();
  @HostBinding('class.app-popover') classPopover = true;

  constructor(private el: ElementRef) {}

  show() {
    this.changeState.emit(true);
  }

  hide() {
    this.changeState.emit(false);
  }

  @HostListener('document:click', ['$event.target'])
  click(target) {
    if (!this.el.nativeElement.contains(target)) {
      this.hide();
    }
  }
}
