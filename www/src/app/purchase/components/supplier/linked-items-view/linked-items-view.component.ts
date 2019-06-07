import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SupplierPurchaseLinkedItem } from '../../../models/supplier-purchase-linked-item';
import {PurchasesSupplierStoreService} from "../../../services/purchases-supplier-store.service";

@Component({
  selector: 'app-purchase-linked-items-view',
  templateUrl: './linked-items-view.component.html',
  styleUrls: ['./linked-items-view.component.css']
})
export class LinkedItemsViewComponent implements OnInit {

  @Input() linkedItems: SupplierPurchaseLinkedItem[] = [];
  @Input() canEditPurchase = true;
  @Output() changeValue = new EventEmitter<{linkedItem: SupplierPurchaseLinkedItem, newValue: number}>();
  @Output() deleteLinkedItem = new EventEmitter<SupplierPurchaseLinkedItem>();

  constructor(protected purchasesStoreService: PurchasesSupplierStoreService) { }

  ngOnInit() {
  }

  protected onChangePrice(item: SupplierPurchaseLinkedItem, newValue: number): void {
    this.changeValue.emit({
      linkedItem: item,
      newValue: Number(newValue)
    });
  }

  protected onDeleteLinkedItem(item: SupplierPurchaseLinkedItem): void {
    this.deleteLinkedItem.emit(item);
  }

}
