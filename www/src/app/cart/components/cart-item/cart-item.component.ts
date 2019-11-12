import { Component, OnInit, Input } from '@angular/core';
import { CartStoreService } from '../../services/cart-store.service';
import { CartItem } from '../../models/cart-item';
import { Uuid } from "../../models/uuid";
import { ContragentInfo } from "../../../contragent/models/contragent-info";
import { ContragentService } from "../../../contragent/services/contragent.service";
import { Observable } from "rxjs";
import { publishReplay, refCount } from "rxjs/operators";
import { getCurrencySymbol } from "@angular/common";

@Component({
  selector: 'cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent {

  @Input() item: CartItem;

  contragent: ContragentInfo;
  contragentInfoModalOpened = false;
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

  showContragentInfo(event: MouseEvent, contragentId: Uuid): void {
    // При клике не даём открыться ссылке из href, вместо этого показываем модальное окно
    event.preventDefault();

    this.contragentInfoModalOpened = true;

    if (!this.contragent || this.contragent.id !== contragentId) {
      this.contragent = null;

      const subscription = this.getContragentService
        .getContragentInfo(contragentId)
        .subscribe(contragentInfo => {
          this.contragent = contragentInfo;
          subscription.unsubscribe();
        });
    }
  }
}
