import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RequestDocument } from "../../../request/common/models/request-document";
import { DocumentIconSize } from "../../../shared/enums/document-icon-size";
import { ContractDocumentsService } from "../../services/contract-documents.service";
import { Contract } from "../../../request/common/models/contract";

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

  @Input() contract: Contract;
  @Input() documents: RequestDocument[] = [];
  @Input() limit = 0;
  @Input() size: DocumentIconSize = DocumentIconSize.medium;

  @Output() selected = new EventEmitter<File[]>();
  showAll = false;

  constructor(
    private contractDocumentsService: ContractDocumentsService
  ) {}

  onDownloadDocument(document: RequestDocument) {
    if (!document.id) {
      return;
    }

    this.contractDocumentsService.downloadFile(document, this.contract.id);
  }

  getDocuments() {
    // Если showAll=true или не указан limit возвращаем всё.
    return this.contract.documents.slice(0, this.showAll ? this.contract.documents.length : (this.limit || this.contract.documents.length));
  }
}
