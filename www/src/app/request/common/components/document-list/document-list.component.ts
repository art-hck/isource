import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { RequestDocument } from "../../models/request-document";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  @Input() documents: RequestDocument[];

  @Output() downloadClick = new EventEmitter<RequestDocument>();
  @Output() fileSelected = new EventEmitter<File[]>();

  constructor() {
  }

  ngOnInit() {
  }

  onDownloadFile() {
    this.downloadClick.emit(this.documents[0]);
  }

  onChangeDocuments(files: File[]) {
    this.fileSelected.emit(Array.from(files));
  }
}
