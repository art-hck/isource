import { Directive, DoCheck, HostBinding, Input, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { UxgWizzardDirective } from "./uxg-wizzard.directive";

@Directive({ selector: '[uxgWizzardButton]' })
export class UxgWizzardButtonDirective implements DoCheck {
  @Input() uxgWizzardButton: "end" | "prev" | "next" | "cancel";
  private created = false;

  get el () {
    return this.templateRef.elementRef.nativeElement.nextElementSibling;
  }

  constructor(
    private host: UxgWizzardDirective,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  ngDoCheck() {
    switch (this.uxgWizzardButton) {
      case "cancel":
        this.toggle(this.host.uxgWizzard.isFirst, () => this.host.cancel.emit());
      break;
      case "prev":
        this.toggle(!this.host.uxgWizzard.isFirst, () => this.host.uxgWizzard.previous());
        break;
      case "next":
        this.toggle(!this.host.uxgWizzard.isLast, () => this.host.uxgWizzard.next(), this.host.uxgWizzard.isCurrentInvalid);
        break;
      case "end":
        this.toggle(this.host.uxgWizzard.isLast, () => this.host.end.emit(), this.host.uxgWizzard.isCurrentInvalid);
        break;
    }
  }

  toggle(state: boolean, click?: () => any, disabled?: boolean) {
    if (state) {
      if (!this.created) {
        this.created = true;
        this.viewContainer.createEmbeddedView(this.templateRef);
        if (click) {
          this.renderer.listen(this.el, "click", click);
        }
      }

      if (disabled !== undefined) {
        this.el.disabled = disabled;
      }
    } else if (this.created) {
      this.created = false;
      this.viewContainer.clear();
    }
  }
}
