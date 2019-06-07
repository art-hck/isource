import {Component, Input, OnInit} from '@angular/core';
import {PurchaseWinnerInfoSupplier} from "../../../models/purchase-winner-info";

@Component({
  selector: 'app-order-supplier',
  templateUrl: './order-supplier.component.html',
  styleUrls: ['./order-supplier.component.css']
})
export class OrderSupplierComponent implements OnInit {

  @Input() supplierInfo: PurchaseWinnerInfoSupplier;

  constructor() { }

  ngOnInit() {
  }

}
