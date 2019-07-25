import { Component, OnInit } from '@angular/core';
import { CartItem } from "../../models/cart-item";
import { CartStoreService } from "../../services/cart-store.service";
import { CartService } from "../../services/cart.service";
import { Router } from "@angular/router";

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    protected cartStore: CartStoreService,
    protected cart: CartService,
    protected router: Router
  ) { }

  ngOnInit() {
  }

  getCartItems(): CartItem[] {
    return this.cartStore.getItems();
  }
}
