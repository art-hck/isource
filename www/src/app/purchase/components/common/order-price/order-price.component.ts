import { Component, Input, OnInit } from '@angular/core';
import {PurchasePricesInterface} from "../../../models/purchase-prices-interface";

@Component({
  selector: 'app-order-price',
  templateUrl: './order-price.component.html',
  styleUrls: ['./order-price.component.css']
})
export class OrderPriceComponent implements OnInit {
  @Input() purchase: PurchasePricesInterface;

  constructor() { }

  ngOnInit() {
  }

  public getOfferCostWithoutDelivery(): number {
    return this.purchase.offerCost + this.purchase.deliveryCost;
  }
}
