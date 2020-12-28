import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RequestDocument } from "../../../request/common/models/request-document";
import { DocumentIconSize } from "../../../shared/enums/document-icon-size";
import { ContractDocumentsService } from "../../services/contract-documents.service";
import { Uuid } from "../../../cart/models/uuid";

/**
 * Компонент для отображение списка документов и скачивания без авторизации
 *
 * Является клоном существующего компонента, но с отправкой запроса на другой метод. Реализация будет пересмотрена.
 */
@Component({
  selector: 'app-contract-documents-list',
  templateUrl: './contract-documents-list.component.html',
  styleUrls: ['./contract-documents-list.component.scss']
})
export class ContractDocumentsListComponent {

  @Input() documents: RequestDocument[] = [];
  @Input() contractId: Uuid;
  @Input() uploadLabel = 'Загрузить';
  @Input() needAuth = true;
  @Input() enableDelete = false;
  @Input() enableUpload = true;
  @Input() uploadedDateHidden = false;
  @Input() sizeInfoHidden = false;
  @Input() gridable = false;
  @Input() limit = 0;
  @Input() size: DocumentIconSize = DocumentIconSize.medium;

  @Output() selected = new EventEmitter<File[]>();
  @Output() delete = new EventEmitter<RequestDocument>();
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  showAll = false;

  constructor(
    private contractDocumentsService: ContractDocumentsService
  ) {}

  onDeleteDocument(document: RequestDocument) {
    this.delete.emit(document);
  }

  onDownloadDocument(document: RequestDocument) {
    if (!document.id) {
      return;
    }

    this.contractDocumentsService.downloadFile(document, this.contractId);
  }

  onChangeDocuments(files: File[]) {
    this.selected.emit(files);

    // очищаем, чтобы можно было снова загрузить тот же файл
    this.uploadElRef.nativeElement.value = '';
  }

  getDocuments() {
    // Если showAll=true или не указан limit возвращаем всё.
    return this.documents.slice(0, this.showAll ? this.documents.length : (this.limit || this.documents.length));
  }
}
