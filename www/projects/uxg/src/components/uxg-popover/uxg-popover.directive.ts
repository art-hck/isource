import { Directive, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from "@angular/core";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { UxgPopoverContentDirection } from "./uxg-popover-direction-enum";
import { UxgPopoverComponent } from "./uxg-popover.component";

@Directive({ selector: '[uxgPopoverContent]' })
export class UxgPopoverContentDirective implements OnInit, OnDestroy {

  @Input() uxgPopoverContent: UxgPopoverContentDirection;

  visible = false;
  subscription = new Subscription();

  constructor(
    private host: UxgPopoverComponent,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this.subscription.add(
      this.host.changeState
        .pipe(filter(visible => visible !== this.visible))
        .subscribe(visible => {
          this.visible = visible;

          if (visible) {
            const view = this.viewContainer.createEmbeddedView(this.templateRef);
            this.renderer.addClass(view.rootNodes[0], `app-popover-content`);
            this.renderer.addClass(view.rootNodes[0], this.uxgPopoverContent || UxgPopoverContentDirection.bottomLeft);
          } else {
            this.viewContainer.clear();
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
