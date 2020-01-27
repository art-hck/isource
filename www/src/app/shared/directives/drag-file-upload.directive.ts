import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appOnDropFile]'
})
export class DragFileUploadDirective {
  @Output() appOnDropFile = new EventEmitter();
  @Input() hoverClass = "hover";

  constructor(private el: ElementRef) {}

  @HostListener("dragover", ["$event"])
  public onDragOver(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.el.nativeElement.classList.add(this.hoverClass);
  }

  @HostListener("dragleave", ["$event"])
  public onDragLeave(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.el.nativeElement.classList.remove(this.hoverClass);
  }

  @HostListener('drop', ['$event'])
  public onDrop(e: Event | any) {
    e.preventDefault();
    e.stopPropagation();
    this.el.nativeElement.classList.remove(this.hoverClass);

    this.appOnDropFile.emit(e.dataTransfer.files);
  }
}
