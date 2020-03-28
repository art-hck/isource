import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject, timer } from "rxjs";
import { distinctUntilChanged, takeUntil } from "rxjs/operators";
import { UxgPopoverTriggerDirective } from "./uxg-popover-trigger.directive";

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

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.openOnHover && !/iPad/i.test(navigator.userAgent)) {
      this.el.nativeElement.addEventListener('mouseenter', this.show);
      this.el.nativeElement.addEventListener('mouseleave', this.hide);
    }
  }

  @HostListener('click', ['$event.target'])
  click(target) {
    return this.triggerEl && this.triggerEl.nativeElement.contains(target) && this.show();
  }

  @HostListener('document:click', ['$event.target'])
  clickOut(target) {
    return this.triggerEl && !this.el.nativeElement.contains(target) && this.hide();
  }

  private toggle(state: boolean, delay: number) {
    this.endTimer$.next();
    return timer(delay).pipe(takeUntil(this.endTimer$)).subscribe(() => this.changeState.next(state));
  }

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('mouseenter', this.show);
    this.el.nativeElement.removeEventListener('mouseleave', this.hide);
    this.endTimer$.next();
    this.endTimer$.complete();
  }
}
