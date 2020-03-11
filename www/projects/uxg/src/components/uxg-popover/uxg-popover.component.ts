import { Component, ContentChild, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, Subscription, timer } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { UxgPopoverTriggerDirective } from "./uxg-popover-trigger.directive";

@Component({
  selector: 'uxg-popover',
  template: '<ng-content></ng-content>'
})
export class UxgPopoverComponent implements OnInit, OnDestroy {
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

    if (this.openOnHover && !/iPad/i.test(navigator.userAgent)) {
      this.el.nativeElement.addEventListener('mouseenter', this.mouseenter);
      this.el.nativeElement.addEventListener('mouseleave', this.mouseleave);
    }
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

  mouseenter = () => this.show();
  mouseleave = () => this.hide();

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('mouseenter', this.mouseenter);
    this.el.nativeElement.removeEventListener('mouseleave', this.mouseleave);
  }
}
