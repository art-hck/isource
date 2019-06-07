import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Page } from "../../../../order/models/page";
import { SupplierPurchaseItem } from "../../../models/supplier-purchase-item";
import {SupplierPurchaseLinkedItem} from "../../../models/supplier-purchase-linked-item";

@Component({
  selector: "app-supplier-positions",
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent implements OnInit {

  @Input() positionsLoading = true;

  // Параметры передаём виде страницы, но для поставщика не используем пагинацию
  @Input() positionsPage: Page<SupplierPurchaseItem>;

  @Input() editablePricesMode: boolean;

  @Output() priceChange = new EventEmitter<{value: number, item: SupplierPurchaseLinkedItem, el: HTMLInputElement}>();

  constructor() { }

  ngOnInit() {
  }

  setMainLinkedItemPrice(params: {value: number, item: SupplierPurchaseLinkedItem, el: HTMLInputElement}): void {
    params.el.value = String(params.value);
  }

  /**
   * Событие, которое триггерится при изменении цены позиции
   *
   * @param value
   * @param item
   */
  onPriceChange(event: any, item: SupplierPurchaseLinkedItem): void {
    const value = event.target.value;
    const el = event.target;
    this.priceChange.emit({value: value, item: item, el: el});
  }

}
