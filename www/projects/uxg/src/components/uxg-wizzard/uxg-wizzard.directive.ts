import { Directive, DoCheck, EventEmitter, Input, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import { UxgWizzard } from "./uxg-wizzard";
import { UxgWizzardStep } from "./uxg-wizzard-step";

@Directive({ selector: '[uxgWizzard]' })
export class UxgWizzardDirective {
  @Input() uxgWizzard: UxgWizzard;
  @Output() cancel = new EventEmitter();
  @Output() end = new EventEmitter();
}

@Directive({ selector: '[uxgWizzardStep]' })
export class UxgWizzardStepDirective implements DoCheck {
  @Input() uxgWizzardStep: UxgWizzardStep<any> | string;
  @Input() uxgWizzardStepValid = true;
  private created = false;

  constructor(
    private host: UxgWizzardDirective,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) {
  }

  ngDoCheck() {
    if (this.host.uxgWizzard.current === this.uxgWizzardStep || this.host.uxgWizzard.current.toString() === this.uxgWizzardStep) {
      this.host.uxgWizzard.get(this.uxgWizzardStep.toString()).validate(this.uxgWizzardStepValid);

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
