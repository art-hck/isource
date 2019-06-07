import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {Order} from "../../models/order";
import {OrdersStoreService} from "../../services/orders-store.service";
import {Router} from "@angular/router";
import { PaginatorComponent } from "../paginator/paginator.component";

@Component({
  selector: 'app-supplier-orders-list',
  templateUrl: './supplier-orders-list.component.html',
  styleUrls: ['./supplier-orders-list.component.css']
})
export class SupplierOrdersListComponent implements AfterViewInit, OnInit {

  @ViewChild(PaginatorComponent, { static: false }) paginator: PaginatorComponent;

  orders: Order[];
  pageUrl: string;
  pageSize = 25;

  constructor(
    protected ordersStore: OrdersStoreService,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.pageUrl = 'orders/list-for-supplier';
  }

  ngAfterViewInit() {
    this.loadOrders();
  }

  protected async loadOrders() {
    await this.ordersStore.loadPage(this.paginator.page, this.paginator.pageSize, this.pageUrl);
    this.paginator.totalCount = this.ordersStore.ordersTotalCount;
    this.orders = this.ordersStore.getOrders();
  }

  protected onChangePage() {
    this.loadOrders();
  }

  protected onResponseButtonClick(order: Order) {
    this.router.navigateByUrl(`orders/supplier/${order.id}/confirmation`);
  }
}
