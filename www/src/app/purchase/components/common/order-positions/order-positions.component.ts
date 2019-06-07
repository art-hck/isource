import { Component, Input, OnInit } from '@angular/core';
import { Page } from "../../../../order/models/page";
import { SupplierPurchaseItem } from "../../../models/supplier-purchase-item";

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  @Input() positionsLoading = true;

  @Input() positionsPage: Page<SupplierPurchaseItem>;

  constructor() { }

  ngOnInit() {
  }

}
