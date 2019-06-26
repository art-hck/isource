import {Component, Input, OnInit} from '@angular/core';
import {RequestDocument} from "../../../back-office/models/request-document";

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  @Input() documents: RequestDocument[];

  constructor() {
  }

  ngOnInit() {
  }
}
