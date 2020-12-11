import { Component, ContentChild, ElementRef, EventEmitter, HostListener, Inject, InjectionToken, Input, OnChanges, OnDestroy, Output, PLATFORM_ID, Renderer2, SimpleChanges, TemplateRef } from '@angular/core';
import { UxgModalFooterDirective } from "./uxg-modal-footer.directive";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";

@Component({
  selector: 'uxg-modal',
  templateUrl: './uxg-modal.component.html',
})
export class UxgModalComponent implements OnDestroy, OnChanges {
  @ContentChild(UxgModalFooterDirective, { read: TemplateRef }) footerTpl: TemplateRef<ElementRef>;
  @Input() state;
  @Input() noBackdrop: boolean;
  @Input() staticBackdrop: boolean;
  @Input() closable = true;
  @Input() size: 'auto' | 's' | 'm' | 'l' = 'm';
  @Input() fullHeight: boolean;
  @Input() scrollContainerElement: HTMLElement = isPlatformBrowser(this.platformId) ? this.document.body : null;
  @Input() hideScrollContainer = true;
  @Output() stateChange = new EventEmitter();

  constructor(
    @Inject(DOCUMENT) private document,
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    private renderer: Renderer2
  ) {}

  is = (prop?: boolean | string) => prop !== undefined && prop !== false && prop !== null;

  ngOnChanges({ state }: SimpleChanges) {
    if (state) {
      this.toggleContainerHostClass();
    }
  }

  open() {
    this.state = true;
    this.toggleContainerHostClass();
    this.stateChange.emit(true);
  }

  @HostListener('document:keyup.esc')
  close() {
    this.state = false;
    this.toggleContainerHostClass();
    this.stateChange.emit(false);
  }

  toggleContainerHostClass() {
    if (this.hideScrollContainer && this.scrollContainerElement) {
      if (this.is(this.state)) {
        this.renderer.addClass(this.scrollContainerElement, "modal-open");
        this.scrollContainerElement.style.paddingRight = this.scrollbarWidth + "px";
      } else {
        this.renderer.removeClass(this.scrollContainerElement, "modal-open");
        this.scrollContainerElement.style.paddingRight = null;
      }
    }
  }

  private get scrollbarWidth() {
    if (!isPlatformBrowser(this.platformId)) {
      return 0;
    }

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
