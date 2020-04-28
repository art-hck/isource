import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Request } from "../../../models/request";
import { RequestPosition } from "../../../models/request-position";
import { Observable } from "rxjs";
import { UxgModalComponent } from "uxg";

@Component({
  selector: 'app-request-add-position-modal',
  templateUrl: './request-add-position-modal.component.html',
  styleUrls: ['./request-add-position-modal.component.scss']
})
export class RequestAddPositionModalComponent {
  @ViewChild(UxgModalComponent) modal: UxgModalComponent;
  @Input() request: Request;
  @Input() onDrafted: (position: RequestPosition) => Observable<RequestPosition>;
  @Output() success = new EventEmitter();
  @Output() uploadFromTemplate = new EventEmitter();
  @Output() cancel = new EventEmitter();

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }
}
