import { Injectable } from '@angular/core';
import { Order } from "../models/order";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { OrderPosition } from "../models/order-position";
import { Observable } from "rxjs";
import { Page } from "../models/page";
import { OrderCost } from "../models/order-cost";

@Injectable()
export class OrdersStoreService {

  protected data: Order[] = [];
  private totalCount: number;

  constructor(
    protected api: HttpClient
  ) {
  }

  public getOrders(): Order[] {
    return this.data;
  }

  get ordersTotalCount(): number {
    return this.totalCount;
  }

  async loadPage(currentPage: number, pageSize: number, pageUrl: string) {
    const data = await this.api.post(
      pageUrl,
      {
        pageNumber: currentPage,
        pageSize: pageSize
      }).toPromise();
    this.createItems(data);
  }

  async getOrderInfoForSupplier(id: string) {
    const url = `orders/${id}/info-for-supplier`;

    return await this.api.post(url, {}).pipe(
      map((data: any) => new Order(data))
    ).toPromise();
  }

  getOrderInfoForCustomer(id: string): Observable<Order> {
    return this.api.post(`orders/${id}/info-for-customer`, {})
      .pipe(
        map(data => new Order(data))
      );
  }

  updateDeliveryCost(order: Order): void {
    this.api.post(`orders/set-delivery-cost`, {
      orderId: order.id,
      deliveryCost: order.deliveryCostValue
    }).subscribe(
      (data: any) => {
        order.totalCost = data.totalCost;
      }
    );
  }

  getOrderPositions(id: string, currentPage: number, pageSize: number): Observable<Page<OrderPosition>> {
    const url = `orders/${id}/positions`;

    return this.api.post<Page<OrderPosition>>(url, {
      pageNumber: currentPage,
      pageSize: pageSize
    }).pipe(
      map((data: any) => {
        return new Page<OrderPosition>(
          data.data.entities.map(rawItem => {
            return new OrderPosition(rawItem);
          }),
          data.data.totalCount
        );
      })
    );
  }

  sendOrder(order: Order): Observable<any> {
    return this.api.post(`orders/${order.id}/supplier-confirm`, {});
  }

  customerSendResolution(order: Order, resolution: string): Observable<void> {
    return this.api.post<void>(`orders/${order.id}/customer/supplier-response-consideration`, {
      response: resolution
    });
  }

  protected createItems(rawData: Object): void {
    this.data = [];

    this.totalCount = rawData['totalCount'];

    for (const rawItem of rawData['entities']) {
      this.data.push(new Order(rawItem));
    }
  }

  setAllPositionResponseType(order: Order, responseType: string): Observable<OrderCost>  {
    return this.api.post(`orders/${order.id}/positions/supplier/setting-response-for-all-positions`, {
      responseType: responseType
    }).pipe(
      map((data: any) => new OrderCost(data.orderCost))
    );
  }

  setSinglePositionResponseType(order: Order, position: OrderPosition, responseType: string): Observable<OrderCost> {
    return this.api.post(`orders/${order.id}/positions/supplier/setting-response-for-single-position`, {
      positionId: position.id,
      responseType: responseType
    }).pipe(
      map((data: any) => new OrderCost(data.orderCost))
    );
  }
}
