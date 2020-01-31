import { Directive, DoCheck, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UxgWizzard } from "./uxg-wizzard";

@Directive({ selector: '[uxgWizzard]' })
export class UxgWizzardDirective {
  @Input() uxgWizzard: UxgWizzard;
}

@Directive({ selector: '[uxgWizzardStep]' })
export class UxgWizzardStepDirective implements DoCheck {
  @Input() uxgWizzardStep;
  private created = false;

  constructor(
    private host: UxgWizzardDirective,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
  }

  ngDoCheck() {
    if (this.host.uxgWizzard.current === this.uxgWizzardStep || this.host.uxgWizzard.current.toString() === this.uxgWizzardStep) {
      if (!this.created) {
        this.created = true;
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else if (this.created) {
      this.created = false;
      this.viewContainer.clear();
    }
  }
}
