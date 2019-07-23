import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '../../core/models/response.model';
import { OrderFormInfo } from '../models/order-form-info';
import { dateToString } from '../../core/utils/date-to-string';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    protected api: HttpClient
  ) { }

  /**
   * Отправка заказа
   *
   * @param orderFormInfo Значения из формы оформления заказа в корзине
   */
  sendOrder(orderFormInfo: OrderFormInfo): Observable<any> {
    const url = 'catalog/add-request-from-cart';
    return this.api.post<Response<Object>>(url, orderFormInfo);
  }

}
