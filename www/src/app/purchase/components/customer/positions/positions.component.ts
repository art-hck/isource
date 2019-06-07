import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page } from "../../../../order/models/page";
import { CustomerPurchaseItem } from "../../../models/customer-purchase-item";
import { ClrDatagridStateInterface } from '@clr/angular';

@Component({
  selector: 'app-customer-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent implements OnInit {

  @Input() positionsLoading: boolean;
  @Input() positionsPage: Page<CustomerPurchaseItem>;
  @Output() refreshPositions = new EventEmitter<ClrDatagridStateInterface>();

  pageSize = 25;

  constructor() { }

  ngOnInit() {
  }

  onRefreshPositions($event) {
    this.refreshPositions.emit($event);
  }
}
