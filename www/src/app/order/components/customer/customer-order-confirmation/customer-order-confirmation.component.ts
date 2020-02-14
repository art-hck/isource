import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { OrdersStoreService } from "../../../services/orders-store.service";
import { Order } from "../../../models/order";
import { ButtonsProfiles } from '../../../enums/buttons-profiles';
import { CustomerButtonProfileTypes } from '../../../dictinaries/customer-button-profile-types';

@Component({
  selector: 'app-customer-order-confirmation',
  templateUrl: './customer-order-confirmation.component.html',
  styleUrls: ['./customer-order-confirmation.component.css']
})
export class CustomerOrderConfirmationComponent implements OnInit {
  order: Order;

  constructor(
    protected route: ActivatedRoute,
    protected ordersStore: OrdersStoreService,
    protected router: Router
  ) { }

  ngOnInit() {
    this.loadOrderInfo();
  }

  protected async loadOrderInfo() {
    const id = this.route.snapshot.paramMap.get('id');
    await this.ordersStore.getOrderInfoForCustomer(id)
      .subscribe((order: Order) => {
        this.order = order;
      });
  }

  onSendResolution(resolution: string|null): void {
    this.ordersStore.customerSendResolution(this.order, resolution).subscribe(() => {
      this.router.navigateByUrl('orders/my-orders');
    });
  }

  getButtonsProfile(): string {
    const status = this.order.currentStatus.type;
    if (status in CustomerButtonProfileTypes) {
      return CustomerButtonProfileTypes[status];
    }
    return ButtonsProfiles.EMPTY;
  }

}
