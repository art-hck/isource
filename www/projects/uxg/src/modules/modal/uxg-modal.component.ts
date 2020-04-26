import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, Output, TemplateRef } from '@angular/core';
import { UxgModalFooterDirective } from "./uxg-modal-footer.directive";

@Component({
  selector: 'uxg-modal',
  templateUrl: './uxg-modal.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UxgModalComponent {
  @ContentChild(UxgModalFooterDirective, { read: TemplateRef }) footerTpl: TemplateRef<ElementRef>;
  @Input() state: boolean;
  @Input() noBackdrop: boolean;
  @Input() staticBackdrop: boolean;
  @Input() closable = true;
  @Input() size: 'auto' | 's' | 'm' | 'l' = 'm';
  @Input() fullHeight: boolean;
  @Output() stateChange = new EventEmitter();

  constructor(private cd: ChangeDetectorRef) {
  }
  is = (prop?: boolean | string) => prop !== undefined && prop !== false && prop !== null;

  open() {
    this.state = true;
    this.stateChange.emit(true);
    // this.cd.detectChanges();
  }

  @HostListener('document:keyup.esc')
  close() {
    this.state = false;
    this.stateChange.emit(false);
    // this.cd.detectChanges();
  }
}
