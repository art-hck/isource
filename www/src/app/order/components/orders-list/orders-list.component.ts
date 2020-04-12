import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {Order} from "../../models/order";
import {OrdersStoreService} from "../../services/orders-store.service";
import { PaginatorComponent } from "../paginator/paginator.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements AfterViewInit, OnInit {

  @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

  orders: Order[];
  pageUrl: string;
  pageSize = 25;

  constructor(
    protected ordersStore: OrdersStoreService,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.pageUrl = 'orders/list-for-customer';
  }

  ngAfterViewInit(): void {
    this.loadOrders();
  }

  protected async loadOrders() {
    await this.ordersStore.loadPage(this.paginator.page, this.paginator.pageSize, this.pageUrl);
    this.paginator.totalCount = this.ordersStore.ordersTotalCount;
    this.orders = this.ordersStore.getOrders();
  }

  onChangePage() {
    this.loadOrders();
  }

  onConsiderationClick(order: Order) {
    this.router.navigateByUrl(`orders/customer/${order.id}/confirmation`);
  }
}
