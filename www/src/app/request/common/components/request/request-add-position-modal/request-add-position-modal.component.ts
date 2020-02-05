import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ClrModal } from "@clr/angular";
import { Request } from "../../../models/request";
import { RequestPosition } from "../../../models/request-position";
import { Observable } from "rxjs";

@Component({
  selector: 'app-request-add-position-modal',
  templateUrl: './request-add-position-modal.component.html'
})
export class RequestAddPositionModalComponent {
  @ViewChild(ClrModal, { static: false }) modal: ClrModal;
  @Input() request: Request;
  @Input() onDrafted: (position: RequestPosition) => Observable<RequestPosition>;
  @Output() success = new EventEmitter();
  @Output() uploadFromTemplate = new EventEmitter();

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }
}
