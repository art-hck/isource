import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '../../core/models/response.model';
import { OrderFormInfo } from '../models/order-form-info';
import { dateToString } from '../../core/utils/date-to-string';
import { CartItem } from "../models/cart-item";

@Injectable({
  providedIn: 'root'
})
export class CartStoreService {

  public cartItems: CartItem[] = [];

  constructor(
    protected api: HttpClient
  ) {
    this.load();
  }

  async load(): Promise<CartItem[]> {
    if (this.cartItems.length === 0) {
      const url = 'catalog/cart/list';
      const resp = await this.api.get<CartItem[]>(url, {responseType: 'json'}).toPromise();
      this.cartItems = resp;
    }
    return this.cartItems;
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getCount(): number {
    return 0; // TODO
  }

  /**
   * Удаление позиции с сервера и из локального хранилища
   *
   * @param item Удаляемя позиция
   */
  async deleteItem(item: CartItem): Promise<boolean> {
    const url = 'catalog/cart/remove-item';
    const params = {
      catalogPositionId: item.catalogPosition.id
    };
    const resp = await this.api.post<Response<Object>>(url, params).toPromise();
    if (!resp) {
      return false;
    }
    this.cartItems = this.cartItems.filter(el => el !== item);
    return true;
  }

  /**
   * Обновление количества на сервере и в локальном хранилище
   *
   * @param item Обновляемая позиция
   * @param quantity Количество
   */
  async updateQuantity(item: CartItem, quantity: number): Promise<boolean> {
    const prevQuantityValue = item.quantity;
    item.quantity = quantity;
    const url = 'catalog/cart/edit-item-quantity';
    const params = {
      catalogPositionId: item.catalogPosition.id,
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
  async sendOrder(supplier: any, orderFormInfo: OrderFormInfo): Promise<boolean> {
    return true;
    /*if (!orderFormInfo.checkFill()) {
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
    return this.deleteSupplierLocal(supplier);*/
  }

  protected findItem(item: CartItem): {supplier: number|null, item: number|null} {
    return null;
    /*let itemIndex = -1;
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
    };*/
  }

}
