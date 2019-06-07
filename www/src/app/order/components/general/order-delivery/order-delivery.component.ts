import { Component, Input, OnInit } from '@angular/core';
import { Order } from "../../../models/order";
import { OrdersStoreService } from "../../../services/orders-store.service";

@Component({
  selector: 'app-order-delivery',
  templateUrl: './order-delivery.component.html',
  styleUrls: ['./order-delivery.component.css']
})
export class OrderDeliveryComponent implements OnInit {

  @Input() order: Order;

  constructor(
    private ordersStore: OrdersStoreService
  ) {
  }

  ngOnInit() {
  }

  onDeliveryCostChange(): void {
    this.ordersStore.updateDeliveryCost(this.order);
  }

  onFreeDeliveryChange(isFree) {
    // при бесплатной доставки устанавливаем нулевую стоимость
    if (isFree) {
      this.order.deliveryCostValue = 0;
    }

    // отправляем изменения на сервер
    this.onDeliveryCostChange();
  }

}
