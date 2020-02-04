import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ClrModal } from "@clr/angular";
import { Request } from "../../../models/request";

@Component({
  selector: 'app-request-add-position-modal',
  templateUrl: './request-add-position-modal.component.html'
})
export class RequestAddPositionModalComponent {
  @ViewChild(ClrModal, { static: false }) modal: ClrModal;
  @Input() request: Request;
  @Output() success = new EventEmitter();
  @Output() uploadFromTemplate = new EventEmitter();

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }
}
