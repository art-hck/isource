import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { UxgPopoverComponent, UxgPopoverContentDirection } from "uxg";
import { AppFile } from "./file";

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent {
  @ViewChild('popover') popover: UxgPopoverComponent;
  @Input() appFile: AppFile;
  @Input() allowed: string[] = [];
  @Input() denied: string[] = [];
  @Input() size: "m" | "s" = 'm';
  @Input() disableDelete = false;
  @Output() delete = new EventEmitter();
  @Output() open = new EventEmitter();

  readonly direction = UxgPopoverContentDirection;

  @HostListener('mouseover')
  showPopover() {
    this.popover?.show();
  }

  @HostListener('mouseout')
  hidePopover() {
    this.popover?.hide();
  }

  @HostListener('click')
  emitClick() {
    this.open.emit();
  }

  map(extensions: string[]) {
    return extensions?.map(ext => '*.' + ext).join(', ');
  }
}
