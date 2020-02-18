import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ClrModal} from "@clr/angular";

@Component({
  selector: 'app-new-request-modal',
  templateUrl: './new-request-modal.component.html',
  styleUrls: ['./new-request-modal.component.scss']
})
export class NewRequestModalComponent implements OnInit {

  @ViewChild(ClrModal, { static: false }) modal: ClrModal;

  @Output() uploadFromTemplate = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }
}
