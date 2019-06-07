import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupplierPurchase } from '../models/supplier-purchase';
import { Uuid } from "../../cart/models/uuid";
import { HttpClient } from "@angular/common/http";
import { Page } from "../../order/models/page";
import { SupplierPurchaseItem } from "../models/supplier-purchase-item";

@Injectable({
  providedIn: 'root'
})
export class SupplierOrderService {

  constructor(
    protected api: HttpClient
  ) {
  }

  /**
   * Возвращает общую информацию о заказе
   *
   * @param id
   */
  getOrderInfo(id: Uuid): Observable<SupplierPurchase> {
    const url = `orders/supplier/${id}/info`;
    return this.api.post<SupplierPurchase>(url, {});
  }


  /**
   * Возвращает позиции для заказа
   *
   * @param id
   */
  getOrderPositions(id: Uuid): Observable<Page<SupplierPurchaseItem>> {
    return this.api.post<Page<SupplierPurchaseItem>>(`orders/supplier/${id}/positions`, {});
  }

  signContract(id: Uuid) {
    const url = `orders/supplier/${id}/contract/sign`;
    return this.api.post(url, {});
  }
}
