import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RequestDocument } from "../../models/request-document";
import { Guid } from "guid-typescript";
import { DocumentsService } from "../../services/documents.service";

/**
 * Компонент для отображение списка документов и загрузки новых документов в этот список
 *
 * Используется для отображения списка уже загруженных документов!
 */
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

  protected uploadInputId;

  constructor(
    private documentsService: DocumentsService
  ) {
    this.uploadInputId = Guid.create();
  }

  ngOnInit() {
  }

  onDeleteDocument(document: RequestDocument) {
    this.delete.emit(document);
  }

  onDownloadDocument(document: RequestDocument) {
    this.documentsService.downloadFile(document);
  }

  onChangeDocuments(files: FileList) {
    this.selected.emit(Array.from(files));
  }
}
