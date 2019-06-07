import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Uuid } from "../../cart/models/uuid";
import { HttpClient } from "@angular/common/http";
import {Page} from "../../order/models/page";
import {SupplierPurchaseItem} from "../models/supplier-purchase-item";
import {CustomerOrder} from "../models/customer-order";

@Injectable({
  providedIn: 'root'
})
export class OrderCustomerService {

  constructor(
    protected api: HttpClient
  ) {
  }

  /**
   * Возвращает общую информацию о заказе
   *
   * @param id
   */
  getOrderInfo(id: Uuid): Observable<CustomerOrder> {
    const url = `orders/customer/${id}/info`;
    return this.api.post<CustomerOrder>(url, {});
  }


  /**
   * Возвращает позиции для заказа
   *
   * @param id
   */
  getOrderPositions(id: Uuid): Observable<Page<SupplierPurchaseItem>> {
    return this.api.post<Page<SupplierPurchaseItem>>(`orders/customer/${id}/positions`, {});
  }


  /**
   * Подписывает загруженный документ
   *
   * @param id
   * @param date
   */
  signDocument(id: Uuid, date: string) {
    return this.api.post<any>(`orders/customer/${id}/contract/sign`, { 'date': date });
  }

}
