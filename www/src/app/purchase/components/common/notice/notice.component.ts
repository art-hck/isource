import { Component, Input, OnInit } from '@angular/core';
import { PurchaseNoticeItem } from "../../../models/purchase-notice-item";

@Component({
  selector: 'app-purchase-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {

  @Input() notice?: PurchaseNoticeItem[];

  constructor() { }

  ngOnInit() {
  }

}
