import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { KimCartItem } from "../../common/models/kim-cart-item";
import { KimDictionaryItem } from "../../common/models/kim-dictionary-item";

@Injectable()
export class KimCartService {
  constructor(private api: HttpClient) {}

  list() {
    const url = `kim/customer/cart/list`;
    return this.api.get<KimCartItem[]>(url);
  }

  addItem(item: KimDictionaryItem, quantity: number) {
    const url = `kim/customer/cart/add-item`;
    return this.api.post<KimCartItem[]>(url, {itemId: item.id, quantity: quantity});
  }
}
