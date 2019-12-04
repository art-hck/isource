import { Directive, ElementRef, Input, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { UxgTabTitleComponent } from "../components/uxg-tab-title/uxg-tab-title.component";

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[uxgTabActive]'
})
export class UxgTabActiveDirective {

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set uxgTabActive(val) {
    if (val) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
