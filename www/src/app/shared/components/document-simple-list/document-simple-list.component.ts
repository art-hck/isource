import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RequestDocument } from "../../../request/common/models/request-document";
import { Guid } from "guid-typescript";
import { DocumentsService } from "../../../request/common/services/documents.service";
import { Uuid } from "../../../cart/models/uuid";
import {DocumentIconSize} from "../../enums/document-icon-size";

/**
 * Компонент для отображение списка документов и загрузки новых документов в этот список
 *
 * Используется для отображения списка уже загруженных документов!
 */
@Component({
  selector: 'app-document-simple-list',
  templateUrl: './document-simple-list.component.html',
  styleUrls: ['./document-simple-list.component.scss']
})
export class DocumentSimpleListComponent implements OnInit {

  @Input() documents: RequestDocument[] = [];

  @Input() deleteLabel = '✖';
  @Input() uploadLabel = 'Загрузить';

  @Input() enableDelete = false;
  @Input() enableUpload = true;
  @Input() limit = 0;

  @Output() selected = new EventEmitter<File[]>();
  @Output() delete = new EventEmitter<RequestDocument>();
  @ViewChild('uploadEl', { static: false }) uploadElRef: ElementRef;

  uploadInputId: Guid;
  documentIconSize = DocumentIconSize;
  showAll = false;

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

    // очищаем, чтобы можно было снова загрузить тот же файл
    this.uploadElRef.nativeElement.value = '';
  }
}
