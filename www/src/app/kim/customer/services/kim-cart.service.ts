import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { KimPriceOrderPosition } from "../../common/models/kim-price-order-position";
import { KimPriceOrder } from "../../common/models/kim-price-order";

@Injectable()
export class KimCartService {
  constructor(private api: HttpClient) {}

  list() {
    const url = `kim/customer/cart`;
    return this.api.get<KimPriceOrderPosition[]>(url);
  }

  create(body: Partial<KimPriceOrder>) {
    const url = `kim/customer/cart/add-price-order`;
    return this.api.post(url, body);
  }
}
