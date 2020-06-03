import { Component, ContentChild, ElementRef, EventEmitter, HostListener, Inject, Input, OnDestroy, Output, Renderer2, TemplateRef } from '@angular/core';
import { UxgModalFooterDirective } from "./uxg-modal-footer.directive";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'uxg-modal',
  templateUrl: './uxg-modal.component.html',
})
export class UxgModalComponent implements OnDestroy {
  @ContentChild(UxgModalFooterDirective, { read: TemplateRef }) footerTpl: TemplateRef<ElementRef>;
  @Input() state;
  @Input() noBackdrop: boolean;
  @Input() staticBackdrop: boolean;
  @Input() closable = true;
  @Input() size: 'auto' | 's' | 'm' | 'l' = 'm';
  @Input() fullHeight: boolean;
  @Input() scrollContainerElement: HTMLElement = this.document.body;
  @Input() hideScrollContainer = true;
  @Output() stateChange = new EventEmitter();

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {
  }

  is = (prop?: boolean | string) => prop !== undefined && prop !== false && prop !== null;

  open() {
    if (this.hideScrollContainer) {
      this.renderer.addClass(this.scrollContainerElement, "modal-open");
      this.scrollContainerElement.style.paddingRight = this.scrollbarWidth + "px";
    }

    this.state = true;
    this.stateChange.emit(true);
  }

  @HostListener('document:keyup.esc')
  close() {
    if (this.hideScrollContainer) {
      this.renderer.removeClass(this.scrollContainerElement, "modal-open");
      this.scrollContainerElement.style.paddingRight = null;
    }

    this.state = false;
    this.stateChange.emit(false);
  }

  private get scrollbarWidth() {
    const outer = this.renderer.createElement('div');
    const inner = this.renderer.createElement('div');

    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    this.document.body.appendChild(outer);
    outer.appendChild(inner);

    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }

  ngOnDestroy() {
    this.close();
  }
}
