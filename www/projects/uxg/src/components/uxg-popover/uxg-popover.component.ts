import { Component, ContentChild, ElementRef, HostBinding, HostListener, Input, OnInit } from "@angular/core";
import { Observable, Subject, Subscription, timer } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { UxgPopoverTriggerDirective } from "./uxg-popover.directive";

@Component({
  selector: 'uxg-popover',
  template: '<ng-content></ng-content>'
})
export class UxgPopoverComponent implements OnInit {
  public changeState$: Observable<boolean>;
  @HostBinding('class.app-popover') classPopover = true;
  @ContentChild(UxgPopoverTriggerDirective, {static: false, read: ElementRef}) triggerEl: ElementRef;
  @Input() openOnHover = false;
  @Input() openDelay = 0;
  @Input() hideDelay = 0;
  private subscription = new Subscription();
  private changeState = new Subject<boolean>();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.changeState$ = this.changeState.asObservable().pipe(distinctUntilChanged());
  }

  show() {
    this.subscription.unsubscribe();
    this.subscription = timer(this.openDelay).subscribe(() => {
      this.changeState.next(true);
    });
  }

  hide() {
    this.subscription.unsubscribe();
    this.subscription = timer(this.hideDelay).subscribe(() => {
      this.changeState.next(false);
    });
  }

  @HostListener('click', ['$event.target'])
  click(target) {
    if (this.triggerEl && this.triggerEl.nativeElement.contains(target)) {
      this.show();
    }
  }

  @HostListener('document:click', ['$event.target'])
  clickOut(target) {
    if (this.triggerEl && !this.el.nativeElement.contains(target)) {
      this.hide();
    }
  }

  @HostListener('mouseenter')
  mouseenter() {
    if (this.openOnHover) { this.show(); }
  }

  @HostListener('mouseleave')
  mouseleave() {
    if (this.openOnHover) { this.hide(); }
  }
}
