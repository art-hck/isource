import { Component, Input } from '@angular/core';
import { CartStoreService } from '../../services/cart-store.service';
import { CartItem } from '../../models/cart-item';
import { ContragentInfo } from "../../../contragent/models/contragent-info";
import { ContragentService } from "../../../contragent/services/contragent.service";
import { getCurrencySymbol } from "@angular/common";

@Component({
  selector: 'cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss']
})
export class CartItemComponent {

  @Input() items: CartItem[];

  contragent: ContragentInfo;
  getCurrencySymbol = getCurrencySymbol;

  constructor(
    protected getContragentService: ContragentService,
    protected store: CartStoreService
  ) { }

  async onDeleteItem(item: CartItem): Promise<boolean> {
    return this.store.deleteItem(item);
  }

  async updateItemQuantity(item: CartItem, quantity: number): Promise<boolean> {
    quantity = Math.abs(quantity);
    return this.store.updateQuantity(item, quantity);
  }

  filterEnteredText(event: KeyboardEvent): boolean {
    const key = Number(event.key);
    return (key >= 0 && key <= 9);
  }
}
