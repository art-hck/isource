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

  addItem({id: itemId}: KimDictionaryItem, quantity: number) {
    const url = `kim/customer/cart/add-item`;
    return this.api.post<KimCartItem[]>(url, {itemId, quantity});
  }

  deleteItem(item: KimCartItem) {
    const url = `kim/customer/cart/remove-item`;
    return this.api.post<KimCartItem[]>(url, {itemId: item.kimDictionaryPosition.id});
  }

  editItem(item: KimCartItem, quantity: number) {
    const url = `kim/customer/cart/edit-item-quantity`;
    return this.api.post<KimCartItem[]>(url, {itemId: item.kimDictionaryPosition.id, quantity: quantity});
  }
}
