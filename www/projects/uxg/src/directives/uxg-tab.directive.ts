import { Directive, ElementRef, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { UxgTabTitleComponent } from "../components/uxg-tab-title/uxg-tab-title.component";
import { Subscription } from "rxjs";

@Directive({
  selector: '[uxgTab]'
})
export class UxgTabDirective implements OnDestroy {

  subscription = new Subscription();

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set uxgTab(tabTitle: UxgTabTitleComponent) {
    this.subscription.add(
      tabTitle.onToggle.subscribe((isVisible) => this.toggle(isVisible))
    );

    this.toggle(tabTitle.active);
  }

  toggle(isVisible) {
    if (isVisible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
