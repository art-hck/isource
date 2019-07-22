import { Component, OnInit } from '@angular/core';
import { CartItem } from "../../models/cart-item";
import { CartStoreService } from "../../services/cart-store.service";

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    protected cartStore: CartStoreService
  ) { }

  ngOnInit() {
  }

  getCartItems(): CartItem[] {
    return this.cartStore.getCartItems();
  }

}