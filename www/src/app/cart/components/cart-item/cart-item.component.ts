import { Component, OnInit, Input } from '@angular/core';
import { CartStoreService } from '../../services/cart-store.service';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {

  @Input() item: CartItem;

  constructor(
    protected store: CartStoreService
  ) { }

  ngOnInit() {
  }

  async onDeleteItem(item: CartItem): Promise<boolean> {
    return this.store.deleteItem(item);
  }

  async updateItemQuantity(item: CartItem, quantity: number): Promise<boolean> {
    quantity = Math.abs(quantity);
    return this.store.updateQuantity(item, quantity);
  }

  filterEnteredText(event: any): void|boolean {
    return (event.key >= 0 && event.key <= 9) ? null : false;
  }
}
