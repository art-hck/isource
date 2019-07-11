import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestDocument } from "../../models/request-document";
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-document-simple-list',
  templateUrl: './document-simple-list.component.html',
  styleUrls: ['./document-simple-list.component.css']
})
export class DocumentSimpleListComponent implements OnInit {

  @Input() documents: RequestDocument[] = [];

  @Input() deleteLabel = '✖';
  @Input() uploadLabel = 'Загрузить';

  @Input() enableDelete = false;
  @Input() enableUpload = true;

  @Output() selected = new EventEmitter<File[]>();
  @Output() delete = new EventEmitter<RequestDocument>();
  @Output() show = new EventEmitter<RequestDocument>();

  protected uploadInputId;

  constructor() {
    this.uploadInputId = Guid.create();
  }

  ngOnInit() {
  }

  onDeleteDocument(document: RequestDocument) {
    this.delete.emit(document);
  }

  onShowDocument(document: RequestDocument) {
    this.show.emit(document);
  }

  onChangeDocuments(files: FileList) {
    this.selected.emit(Array.from(files));
  }
}
