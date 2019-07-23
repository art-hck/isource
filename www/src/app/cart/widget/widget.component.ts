import { Component, OnInit } from '@angular/core';
import { CartStoreService } from "../services/cart-store.service";
import { Router } from '@angular/router';

@Component({
  selector: 'cart-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {

  constructor(
    protected loader: CartStoreService,
    protected router: Router
  ) { }

  ngOnInit() {
  }

  onCartClick() {
    this.router.navigateByUrl('/cart');
  }

}
