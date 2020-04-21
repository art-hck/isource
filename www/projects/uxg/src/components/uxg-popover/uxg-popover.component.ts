import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, HostBinding, Inject, Input, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Subject, timer } from "rxjs";
import { distinctUntilChanged, takeUntil } from "rxjs/operators";
import { UxgPopoverTriggerDirective } from "./uxg-popover-trigger.directive";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'uxg-popover',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UxgPopoverComponent implements OnInit, OnDestroy {
  @HostBinding('class.app-popover') classPopover = true;
  @ContentChild(UxgPopoverTriggerDirective, {static: true, read: ElementRef}) triggerEl: ElementRef;
  @Input() openOnHover = false;
  @Input() openDelay = 0;
  @Input() hideDelay = 0;
  private readonly changeState = new Subject<boolean>();
  private readonly endTimer$ = new Subject();
  public readonly changeState$ = this.changeState.asObservable().pipe(distinctUntilChanged());
  readonly show = () => this.toggle(true, this.openDelay);
  readonly hide = () => this.toggle(false, this.hideDelay);

  constructor(private el: ElementRef, private ngZone: NgZone, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.openOnHover && !/iPad/i.test(navigator.userAgent)) {
        this.el.nativeElement.addEventListener('mouseenter', this.show);
        this.el.nativeElement.addEventListener('mouseleave', this.hide);
      } else {
        this.el.nativeElement.addEventListener('click', this.click);
        this.document.addEventListener('click', this.clickOut);
      }
    });
  }

  click = (e) => this.triggerEl && this.triggerEl.nativeElement.contains(e.target) && this.show();
  clickOut = (e) => !this.el.nativeElement.contains(e.target) && this.hide();

  private toggle(state: boolean, delay: number) {
    this.endTimer$.next();
    timer(delay).pipe(takeUntil(this.endTimer$)).subscribe(() => this.ngZone.run(() => this.changeState.next(state)));
  }

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('mouseenter', this.show);
    this.el.nativeElement.removeEventListener('mouseleave', this.hide);
    this.document.removeEventListener('click', this.clickOut);
    this.el.nativeElement.removeEventListener('click', this.click);
    this.endTimer$.next();
    this.endTimer$.complete();
  }
}
