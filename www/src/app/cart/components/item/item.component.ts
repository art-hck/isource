import { Component, OnInit, Input } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Item } from '../../models/item';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'div.app-cart-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input() item: Item;

  constructor(
    protected store: StoreService,
    protected http: HttpClient
  ) { }

  ngOnInit() {
  }

  async onDeleteItem(item: Item): Promise<boolean> {
    return this.store.deleteItem(item);
  }

  async updateItemQuantity(item: Item, quantity: number): Promise<boolean> {
    return this.store.updateQuantity(item, quantity);
  }

}
