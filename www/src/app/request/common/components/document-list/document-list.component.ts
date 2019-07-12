import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { RequestDocument } from "../../models/request-document";
import { DocumentsService } from "../../services/documents.service";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  @Input() documents: RequestDocument[];

  @Output() fileSelected = new EventEmitter<File[]>();

  constructor(
    private documentsService: DocumentsService
  ) {
  }

  ngOnInit() {
  }

  onDownloadFile(document: RequestDocument) {
    this.documentsService.downloadFile(document);
  }

  onChangeDocuments(files: File[]) {
    this.fileSelected.emit(Array.from(files));
  }
}
