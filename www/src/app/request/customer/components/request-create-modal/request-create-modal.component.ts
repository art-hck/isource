import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ClrModal } from "@clr/angular";

@Component({
  selector: 'app-request-create-modal',
  templateUrl: './request-create-modal.component.html'
})
export class RequestCreateModalComponent {

  @ViewChild(ClrModal, { static: false }) modal: ClrModal;

  @Output() uploadFromTemplate = new EventEmitter();
  @Output() publishFromTemplate = new EventEmitter();
  @Output() cancel = new EventEmitter();

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }
}
