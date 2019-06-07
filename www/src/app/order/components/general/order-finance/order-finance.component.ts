import { Component, Input, OnInit } from '@angular/core';
import { Order } from "../../../models/order";

@Component({
  selector: 'app-order-finance',
  templateUrl: './order-finance.component.html',
  styleUrls: ['./order-finance.component.css']
})
export class OrderFinanceComponent implements OnInit {

  @Input() order: Order;

  constructor() {
  }

  ngOnInit() {
  }

}
