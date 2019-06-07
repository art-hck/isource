import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { SupplierPurchase } from 'src/app/purchase/models/supplier-purchase';
import { SupplierPurchaseItem } from 'src/app/purchase/models/supplier-purchase-item';
import {SupplierProcedureStoreService} from "../../../services/supplier-procedure-store.service";

@Component({
  selector: 'app-purchase-supplier-procedure-offer-cost',
  templateUrl: './procedure-offer-cost.component.html',
  styleUrls: ['./procedure-offer-cost.component.css']
})
export class ProcedureOfferCostComponent implements OnInit {

  @Input() purchase: SupplierPurchase;
  @Input() deliveryCost: number;
  @Input() purchaseItems: SupplierPurchaseItem[] = [];
  @Input() editableMode = false;

  @Output() deliveryPrice = new EventEmitter<number>();

  constructor(
    protected store: SupplierProcedureStoreService
  ) { }

  ngOnInit() {
  }

  protected onChangeDeliveryCost(newCost: number): void {
    this.store.deliveryCost = newCost;
    this.deliveryPrice.emit(newCost);
  }

  protected getOfferCostWithDelivery(): number {
    return +this.purchase.offerCost + +this.deliveryCost;
  }

}
