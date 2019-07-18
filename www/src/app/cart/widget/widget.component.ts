import { Component, OnInit } from '@angular/core';
import { StoreService } from "../services/store.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {

  constructor(
    public loader: StoreService,
    protected router: Router
  ) { }

  ngOnInit() {
  }

  onCartClick() {
    this.router.navigateByUrl('/cart');
  }

}
