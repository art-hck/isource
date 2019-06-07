import { Component, OnInit } from '@angular/core';
import { StoreService } from '../services/store.service';
import { Supplier } from '../models/supplier';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  constructor(
    protected store: StoreService
  ) { }

  ngOnInit() {
  }

  getSuppliers(): Supplier[] {
    return this.store.getSuppliers();
  }

}
