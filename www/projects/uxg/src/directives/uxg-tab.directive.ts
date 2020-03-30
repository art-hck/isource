import { Directive, ElementRef, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { UxgTabTitleComponent } from "../components/uxg-tab-title/uxg-tab-title.component";
import { Subject } from "rxjs";
import { startWith, takeUntil } from "rxjs/operators";

@Directive({
  selector: '[uxgTab]'
})
export class UxgTabDirective implements OnDestroy {

  readonly destroy$ = new Subject();

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set uxgTab({onToggle, active}: UxgTabTitleComponent) {
      onToggle.pipe(startWith(active), takeUntil(this.destroy$)).subscribe((isVisible) => this.toggle(isVisible));
  }

  toggle(isVisible) {
    if (isVisible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
