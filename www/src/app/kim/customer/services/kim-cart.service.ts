import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { KimCartItem } from "../../common/models/kim-cart-item";

@Injectable()
export class KimCartService {
  constructor(private api: HttpClient) {}

  list() {
    const url = `kim/customer/cart`;
    return this.api.get<KimCartItem[]>(url);
  }
}
