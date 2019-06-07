import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SupplierPurchaseItem } from "../../../models/supplier-purchase-item";
import { SupplierPurchaseLinkedItem } from "../../../models/supplier-purchase-linked-item";

@Component({
  selector: 'app-supplier-requirement-positions',
  templateUrl: './requirement-positions.component.html',
  styleUrls: ['./requirement-positions.component.css']
})
export class RequirementPositionsComponent implements OnInit {

  @Input() positions: SupplierPurchaseItem;

  /**
   * Определяет доступно ли редактирование позиций
   */
  @Input() editable: boolean;

  @Output() changeAvailability = new EventEmitter<{
    position: SupplierPurchaseItem,
    newValue: boolean
  }>();
  @Output() changeLinkedItemPriceValue = new EventEmitter<{
    position: SupplierPurchaseItem,
    linkedItem: SupplierPurchaseLinkedItem,
    newValue: number
  }>();
  @Output() deleteLinkedItem = new EventEmitter<{
    position: SupplierPurchaseItem,
    linkedItem: SupplierPurchaseLinkedItem
  }>();
  @Output() clickAddLinkedItem = new EventEmitter<SupplierPurchaseItem>();

  constructor() {
  }

  ngOnInit() {
  }

  protected getToggleSwitchId(item: SupplierPurchaseItem): string {
    return `available-switcher-for-${item.id}`;
  }

  protected onChangeAvailability(event: MouseEvent, supplierPurchaseItem: SupplierPurchaseItem): void {
    const inputEl = event.target as HTMLInputElement;
    const newValue = inputEl.checked;

    // если нет ни одной привязанной позиции, не даем включить наличие
    if (supplierPurchaseItem.linkedItems.length === 0) {
      inputEl.checked = false;
      return;
    }

    this.changeAvailability.emit({
      position: supplierPurchaseItem,
      newValue: newValue
    });
  }

  protected isEmptyLinkedItems(item: SupplierPurchaseItem): boolean {
    return (!item.linkedItems || item.linkedItems.length === 0);
  }

  protected onChangeLinkedItemPriceValue(
    position: SupplierPurchaseItem,
    params: { linkedItem: SupplierPurchaseLinkedItem, newValue: number }
  ): void {
    this.changeLinkedItemPriceValue.emit({
      position: position,
      linkedItem: params.linkedItem,
      newValue: params.newValue
    });
  }

  protected onDeleteLinkedItem(item: SupplierPurchaseItem, linkedItem: SupplierPurchaseLinkedItem): void {
    this.deleteLinkedItem.emit({
      position: item,
      linkedItem: linkedItem
    });
  }

  onClickAddLinkedItem(value) {
    this.clickAddLinkedItem.emit(value);
  }
}
