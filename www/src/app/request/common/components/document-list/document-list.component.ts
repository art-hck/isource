import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { RequestDocument } from "../../models/request-document";
import {AttachedFile} from "../../models/attached-file";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  @Input() documents: RequestDocument[];

  @Output() downloadClick = new EventEmitter<RequestDocument>();

  constructor() {
  }

  ngOnInit() {
  }


  onDownloadFile() {
    console.log('emitted');
    this.downloadClick.emit(this.documents[0]);
  }

}
