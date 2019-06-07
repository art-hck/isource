import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupplierPurchase } from '../models/supplier-purchase';
import { Uuid } from "../../cart/models/uuid";
import { SupplierPurchaseItem } from '../models/supplier-purchase-item';
import { SupplierPurchaseLinkedItem } from '../models/supplier-purchase-linked-item';
import { SupplierPriceListItem } from '../models/supplier-price-list-item';
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";


@Injectable()
export class PurchasesSupplierStoreService {

  changeSum = new EventEmitter<number>();
  changeOfferCount = new EventEmitter<number>();

  protected purchaseInfo?: SupplierPurchase;
  protected data: SupplierPurchase[] = [];

  constructor(
    protected api: HttpClient
  ) { }

  getPurchasesList(): SupplierPurchase[] {
    return this.data;
  }

  async loadPage(filters) {
    this.data = await this.api.post<SupplierPurchase[]>('purchases/supplier/list', {filters: filters})
      .toPromise();
    return this.data;
  }

  getPurchaseInfoForSupplier(id: Uuid): Observable<SupplierPurchase> {
    const url = `purchases/supplier/${id}/info`;
    return this.api.post<any>(url, {}).pipe(
      map(data => {
        this.purchaseInfo = data;
        return <SupplierPurchase>data;
      })
    );
  }

  getPurchaseItems(id: Uuid): Observable<SupplierPurchaseItem[]> {
    const url = `purchases/supplier/${id}/positions`;
    return this.api.post<any>(url, {}).pipe(
      map(data => {
        const items: SupplierPurchaseItem[] = data.entities.map((item): SupplierPurchaseItem => {
          return <SupplierPurchaseItem>item;
        });

        items.forEach((item) => {
          const minAnalog = this.findMinAnalogue(item.linkedItems);

          if (minAnalog !== null) {
            minAnalog.isMainItem = true;
          }
        });
        return items;
      })
    );
  }

  protected findMinAnalogue(linkedItems: SupplierPurchaseLinkedItem[]): SupplierPurchaseLinkedItem|null {
    const mainItem = linkedItems.find((item) => item.isMainItem);
    if (mainItem) {
      return null;
    }
      const array = linkedItems.filter((item) => item.analogue);
      if (array.length === 0) {
        return null;
      }
      array.sort((li1, li2) => {
        return li1.price - li2.price;
      });
      return array[0];
  }

  replyOnRequirement(id: Uuid) {
    const url = `purchases/supplier/${id}/submit`;
      this.api.post(url, {}).toPromise();
  }

  deleteLinkedItem(item: SupplierPurchaseItem, deletedLinkedItem: SupplierPurchaseLinkedItem): void {
    this.sendDeleteLinkedItem(item, deletedLinkedItem);
    if (!item.linkedItems || item.linkedItems.length === 0) {
      return;
    }
    const index = item.linkedItems.indexOf(deletedLinkedItem);
    if (index < 0) {
      return;
    }

    item.linkedItems.splice(index, 1);

    if (item.linkedItems.length === 0) {
      this.calcOfferCostAfterDelete(item, deletedLinkedItem);
      item.availability = false;
      this.purchaseInfo.offerCount -= 1;
      return;
    }

    if (!deletedLinkedItem.isMainItem) {
      return;
    }

    const minAnalog = this.findMinAnalogue(item.linkedItems);

    if (minAnalog !== null) {
      minAnalog.isMainItem = true;
    }

    this.calcOfferCostAfterDelete(item, deletedLinkedItem, minAnalog);
  }

  sendDeleteLinkedItem(item: SupplierPurchaseItem, deletedLinkedItem: SupplierPurchaseLinkedItem) {
    this.api.post(
      `/purchases/supplier/${this.purchaseInfo.id}/delete-links`,
      {
        categoryProductId: item.id,
        supplierOfferPositionId: deletedLinkedItem.id
      }).toPromise();
  }

  changeLinkedItemPrice(item: SupplierPurchaseItem, linkedItem: SupplierPurchaseLinkedItem, newValue: number): void {
    this.sendNewLinkedItemPrice(item, linkedItem, newValue);
    const oldValue = linkedItem.price;
    linkedItem.price = Number(newValue);
    if (!item.availability) {
      return;
    }
    const delta = (Number(newValue) - oldValue) * item.quantity;
    if (linkedItem.isMainItem) {
      this.purchaseInfo.offerCost += delta;
      this.changeSum.emit(this.purchaseInfo.offerCost);
    }
  }

  sendNewLinkedItemPrice(item: SupplierPurchaseItem, linkedItem: SupplierPurchaseLinkedItem, newValue: number) {
    this.api.post(
      `/purchases/supplier/${this.purchaseInfo.id}/edit-links`,
      {
        categoryProductId: item.id,
        supplierOfferPositionId: linkedItem.id,
        newPrice: newValue
      }).toPromise();
  }

  changeAvailableItem(id: Uuid, item: SupplierPurchaseItem, available: boolean): boolean {
    let sign: number;
    let delta: number;

    const linkedItem = this.getLinkedItem(item);
    if (!linkedItem) {
      return false;
    }
    sign = available ? 1 : -1;
    delta = sign * linkedItem.price * item.quantity;
    item.availability = available;
    this.purchaseInfo.offerCost += delta;
    this.purchaseInfo.offerCount += item.availability === false ? -1 : 1;
    this.changeSum.emit(this.purchaseInfo.offerCost);
    this.changeOfferCount.emit(this.purchaseInfo.offerCount);
    this.sendAvailableItem(id, item, available);
    return true;
  }

  sendAvailableItem(id: Uuid, item: SupplierPurchaseItem, available: boolean) {
      const url = `purchases/supplier/${id}/in-stock`;
      this.api.post(url, {
        categoryProductId: item.id,
        inStock: available
      }).toPromise();
    }

  protected getLinkedItem(item: SupplierPurchaseItem): SupplierPurchaseLinkedItem|null {
    if (!item.linkedItems || item.linkedItems.length === 0) {
      return null;
    }
    return item.linkedItems.find((linkedItem) => linkedItem.isMainItem) || null;
  }

  // Проверяем, есть ли выбранная в прайс-листе позиция в списке или нет
  checkPriceListItemInList(array: SupplierPurchaseLinkedItem[], id: Uuid): boolean {
    const item = array.find((obj) => obj.priceListId === id);
    return Boolean(item);
  }

  // Получаем основную позицию, есть ли в раскрытом списке позиций она есть
  getSelectedMainItem(array: SupplierPurchaseLinkedItem[]) {
    const item = array.find((obj) => obj.isMainItem === true);
    return item;
  }

  getAnalogueItemWithMinCost(linkedItems: SupplierPurchaseLinkedItem[]): SupplierPurchaseLinkedItem|null {

    const array = linkedItems.filter((item) => item.analogue);
    if (array.length === 0) {
      return null;
    }
    array.sort((li1, li2) => {
      return li1.price - li2.price;
    });
    return array[0];
  }

  setItemAsAnalogue(
    selectedPurchaseItem: SupplierPurchaseItem,
    supplierPriceListItem: SupplierPriceListItem,
    purchaseLinkedItemId: Uuid
  ): boolean {

    const
      mainItem = this.getSelectedMainItem(selectedPurchaseItem.linkedItems),
      priceListId = supplierPriceListItem.id,
      existsPriceListItemInList = this.checkPriceListItemInList(selectedPurchaseItem.linkedItems, priceListId),
      analogue = true;
    // Признак основной позиции, если не ноль, то пушим позицию прайс-листа в список смэпленных позиций
    let isMain = null;

    // Если позиция уже есть в списке смэпленных, то ничего не делаем
    if (existsPriceListItemInList) {
      return false;
    }

    // Если основная позиция есть и она не аналог, то просто добавляем позицию как аналог
    if (mainItem && mainItem.analogue === false) {
      isMain = false;
    }

    // Если основной позиции нет, то добавляем аналог как основную позицию и пересчитываем цену потребности
    if (!mainItem) {
      selectedPurchaseItem.availability = true;
      const delta = selectedPurchaseItem.quantity * supplierPriceListItem.priceWithVat;
      this.purchaseInfo.offerCost += delta;
      this.purchaseInfo.offerCount += 1;
      this.changeSum.emit(this.purchaseInfo.offerCost);
      isMain = true;
    }

    // Если основная позиция есть и она аналог, то получаем цену этой позиции
    if (mainItem && mainItem.analogue === true) {
      const analogueItemWithMinCost = this.getAnalogueItemWithMinCost(selectedPurchaseItem.linkedItems);

      // Если цена добавляемой позиции меньше цены уже существующей в списке, то делаем добавляему позицию основной
      if (supplierPriceListItem.priceWithVat < analogueItemWithMinCost.price) {
        analogueItemWithMinCost.isMainItem = false;
        isMain = true;
      } else {
        isMain = false;
      }
    }

    if (isMain !== null) {
      this.pushPriceListItem(selectedPurchaseItem, supplierPriceListItem, purchaseLinkedItemId, analogue, isMain);
    }
    return !existsPriceListItemInList;
  }

  pushPriceListItem (
    selectedPurchaseItem: SupplierPurchaseItem,
    supplierPriceListItem: SupplierPriceListItem,
    purchaseLinkedItemId: Uuid,
    analog: boolean,
    isMainItem: boolean
  ) {
    selectedPurchaseItem.linkedItems.push({
      id: purchaseLinkedItemId,
      priceListId: supplierPriceListItem.id,
      title: supplierPriceListItem.itemName,
      price: supplierPriceListItem.priceWithVat,
      analogue: analog,
      isMainItem: isMainItem,
    });
  }

  setItemAsMain(
    selectedPurchaseItem: SupplierPurchaseItem,
    supplierPriceListItem: SupplierPriceListItem,
    purchaseLinkedItemId: Uuid
  ): boolean {
    const id = supplierPriceListItem.id;
    const existsSelectedItemHasMainItem = this.getSelectedMainItem(selectedPurchaseItem.linkedItems);

    // Проверяем, содержит ли смэпленный список основную позицию или нет
    if (existsSelectedItemHasMainItem) {
      existsSelectedItemHasMainItem.isMainItem = false;
    }
    this.pushPriceListItem(
      selectedPurchaseItem,
      supplierPriceListItem,
      purchaseLinkedItemId,
      false,
      true);
    selectedPurchaseItem.availability = true;
    const delta = selectedPurchaseItem.quantity * supplierPriceListItem.priceWithVat;
    this.purchaseInfo.offerCost += delta;
    this.purchaseInfo.offerCount += 1;
    this.changeSum.emit(this.purchaseInfo.offerCost);
    return !existsSelectedItemHasMainItem;
  }

  protected calcOfferCostAfterDelete(
    item: SupplierPurchaseItem,
    deletedLinkedItem: SupplierPurchaseLinkedItem,
    newLinkedItem?: SupplierPurchaseLinkedItem
  ): void {
    if (!item.availability) {
      return;
    }
    let delta = 0;
    if (deletedLinkedItem.isMainItem) {
      delta = -deletedLinkedItem.price * item.quantity;
    }
    if (newLinkedItem && newLinkedItem.isMainItem) {
      delta += newLinkedItem.price * item.quantity;
    }
    if (delta !== 0) {
      this.purchaseInfo.offerCost += delta;
      this.changeSum.emit(this.purchaseInfo.offerCost);
    }
  }

  // Проверяем, есть ли в раскрытом списке позиций «Основная» позиция
  checkSelectedItemHasMainItem(array: SupplierPurchaseLinkedItem[]): boolean {
    const item = array.find((obj) => obj.isMainItem === true && obj.analogue === false);
    return Boolean(item);
  }

  mapPosition(priceListItemId: Uuid, selectedPurchaseItem: Uuid, isMainItem: boolean) {
     return this.api.post(
      `/purchases/supplier/${this.purchaseInfo.id}/register-links`,
      {
        categoryProductId: selectedPurchaseItem,
        itemId: priceListItemId,
        isMainItem: isMainItem }).pipe(
          map(data => {
            return <SupplierPurchaseLinkedItem>data;
     }));
  }

  changeDeliveryCost(deliveryCost: number) {
    return this.api.post(
      `purchases/supplier/${this.purchaseInfo.id}/change-delivery-cost`,
      {deliveryCost: deliveryCost}
    );
  }
}
