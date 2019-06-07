import { Injectable } from '@angular/core';
import { Item } from '../models/item';
import { Supplier } from '../models/supplier';
import { HttpClient } from '@angular/common/http';
import { Response } from '../../core/models/response.model';
import { OrderFormInfo } from '../models/order-form-info';
import { dateToString } from '../../core/utils/date-to-string';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  protected suppliers: Supplier[] = [];

  constructor(
    protected api: HttpClient
  ) {
    this.load();
  }

  async load(): Promise<Supplier[]> {
    if (this.suppliers.length === 0) {
      const url = 'cart/list';
      const resp = await this.api.get<Object>(url, {responseType: 'json'}).toPromise();
      const data = this.createItems(resp);
      this.suppliers = this.createItemsStoreBySuppliers(data);
    }
    return this.suppliers;
  }

  getCount(): number {
    let count = 0;
    for (const supplier of this.suppliers) {
      count += supplier.items.length;
    }
    return count;
  }

  getSuppliers(): Supplier[] {
    return this.suppliers;
  }

  /**
   * Удаление позиции с сервера и из локального хранилища
   *
   * @param item Удаляемя позиция
   */
  async deleteItem(item: Item): Promise<boolean> {
    const findRes = this.findItem(item);
    if (findRes.item === null) {
      return false;
    }
    const url = 'cart/remove';
    const params = {
      item_id: item.item_id
    };
    const resp = await this.api.post<Response<Object>>(url, params).toPromise();
    if (!resp) {
      return false;
    }
    const supplier = this.suppliers[findRes.supplier];
    supplier.items = supplier.items.filter(el => el !== item);
    if (supplier.items.length === 0) {
      this.suppliers.splice(findRes.supplier, 1);
    }
    return true;
  }

  /**
   * Удаление всех позиций от одного поставщика с сервера и из локального хранилища
   *
   * @param supplier Удаляемый поставщик
   */
  async deleteSupplier(supplier: Supplier): Promise<boolean> {
    const supplierIndex = this.suppliers.indexOf(supplier);
    if (supplierIndex < 0) {
      return false;
    }
    const url = 'cart/remove-by-supplier-id';
    const params = {
      supplier_id: supplier.id
    };
    const resp = await this.api.post<Response<Object>>(url, params).toPromise();
    if (!resp) {
      return false;
    }
    return this.deleteSupplierLocal(supplier);
  }

  /**
   * Удаление всех позиций от одного поставщика из локального хранилища
   *
   * @param supplier Удаляемый поставщик
   */
  deleteSupplierLocal(supplier: Supplier): boolean {
    const supplierIndex = this.suppliers.indexOf(supplier);
    if (supplierIndex < 0) {
      return false;
    }
    this.suppliers.splice(supplierIndex, 1);
    return true;
  }

  /**
   * Обновление количества на сервере и в локальном хранилище
   *
   * @param item Обновляемая позиция
   * @param quantity Количество
   */
  async updateQuantity(item: Item, quantity: number): Promise<boolean> {
    const findRes = this.findItem(item);
    if (findRes.item === null) {
      return false;
    }
    const prevQuantityValue = item.quantity;
    item.quantity = quantity;
    const url = 'cart/update-quantity';
    const params = {
      item_id: item.item_id,
      quantity: quantity
    };
    const resp = await this.api.post<Response<Object>>(url, params).toPromise();
    if (!resp) {
      item.quantity = prevQuantityValue;
      return false;
    }
    return true;
  }

  /**
   * Отправка заказа
   *
   * @param supplier Поставщик и выбранные позиции
   * @param orderFormInfo Значения из формы оформления заказа в корзине
   */
  async sendOrder(supplier: Supplier, orderFormInfo: OrderFormInfo): Promise<boolean> {
    if (!orderFormInfo.checkFill()) {
      return false;
    }
    const url = 'order/publish-direct-order';
    const params = {
      supplierContragentId: supplier.id,
      supplierResponseDate: dateToString(orderFormInfo.dateResponse),
      deliveryAddress: orderFormInfo.address,
      deliveryDate: dateToString(orderFormInfo.dateDelivery),
      additionalInformation: orderFormInfo.comment
    };
    const resp = await this.api.post<Response<Object>>(url, params).toPromise();
    if (!resp) {
      return false;
    }
    return this.deleteSupplierLocal(supplier);
  }

  protected createItems(rawData: any): Item[] {
    const res = [];
    if (!rawData) {
      return res;
    }
    for (const rawItem of rawData) {
      res.push(new Item(rawItem));
    }
    return res;
  }

  protected createItemsStoreBySuppliers(data: Item[]): Supplier[] {
    const grouper = (res: Object, currentValue: Item) => {
      const supplierId = currentValue.supplier.id;
      if (!res.hasOwnProperty(supplierId)) {
        res[supplierId] = [];
      }
      res[supplierId].push(currentValue);
      return res;
    };
    const grouped: {[key: string]: Item[]} = data.reduce(grouper, {});
    return Object.keys(grouped).map((supplierId: string) => {
      const supplierName = grouped[supplierId][0].supplier.name;
      return new Supplier({
        id: supplierId,
        name: supplierName,
        items: grouped[supplierId]
      });
    });
  }

  protected findItem(item: Item): {supplier: number|null, item: number|null} {
    let itemIndex = -1;
    let supplierIndex = -1;

    const supplier = this.suppliers.find((s: Supplier) => {
      itemIndex = s.items.indexOf(item);
      return Boolean(itemIndex >= 0);
    });

    if (supplier) {
      supplierIndex = this.suppliers.indexOf(supplier);
    }

    return {
      supplier: (supplierIndex < 0 ? null : supplierIndex),
      item: (itemIndex < 0 ? null : itemIndex)
    };
  }

}
