import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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

  @ViewChild('uploadEl', { static: false }) uploadElRef: ElementRef;

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

    // очищаем, чтобы можно было снова загрузить тот же файл
    this.uploadElRef.nativeElement.value = '';
  }
}
