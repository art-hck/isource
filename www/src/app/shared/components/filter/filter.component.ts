import { Component, EventEmitter, HostBinding, Inject, Input, Output, Renderer2 } from '@angular/core';
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html'
})
export class FilterComponent {
  @HostBinding('class.app-filter') class = true;
  @HostBinding('class.app-col-aside') colAside = true;
  @HostBinding('class.app-row') row = true;
  @HostBinding('class.app-flex-column') flexColumn = true;
  @HostBinding('class.detachable') detachable = true;
  @HostBinding('class.open') isOpen: boolean;
  @Input() count: number;
  @Input() dirty: boolean;
  @Output() submit = new EventEmitter();
  @Output() reset = new EventEmitter();

  public open() {
    this.renderer.addClass(this.document.body, "filter-open");
    this.isOpen = true;
  }

  public close() {
    this.renderer.removeClass(this.document.body, "filter-open");
    this.isOpen = false;
  }

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {}
}
