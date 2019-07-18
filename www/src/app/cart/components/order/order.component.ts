import { Component, OnInit, Input } from '@angular/core';
import { Supplier } from '../../models/supplier';
import { StoreService } from '../../services/store.service';
import { OrderFormInfo } from '../../models/order-form-info';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  @Input() supplier: Supplier|null = null;

  dateDeliveryInvalid = false;
  addressInvalid = false;
  dateResponseInvalid = false;
  data: OrderFormInfo;

  constructor(
    protected store: StoreService,
    protected router: Router
  ) {
    this.data = new OrderFormInfo({});
  }

  ngOnInit() {
  }

  set dateResponse(value: Date|null) {
    this.data.dateResponse = value;
    this.updateDateFieldInvalidState();
  }

  get dateResponse(): Date|null {
    return this.data.dateResponse;
  }

  set dateDelivery(value: Date|null) {
    this.data.dateDelivery = value;
    this.updateDateFieldInvalidState();
  }

  get dateDelivery(): Date|null {
    return this.data.dateDelivery;
  }

  set address(value: string) {
    this.data.address = value;
    this.updateAddressInvalidState();
  }

  get address(): string {
    return this.data.address;
  }

  async onOrderButtonClick() {
    this.updateDateFieldInvalidState();
    this.updateAddressInvalidState();
    if (this.dateDeliveryInvalid || this.dateResponseInvalid || this.addressInvalid) {
      return;
    }
    const orderRes = await this.store.sendOrder(this.supplier, this.data);
    if (orderRes) {
      this.router.navigateByUrl('orders/my-orders');
    }
  }

  updateDateFieldInvalidState() {
    const todayDate = new Date(); // Получаем текущую дату (включая время)
    todayDate.setHours(0, 0, 0, 0); // Сбрасываем часы, минуты и секунды до 00:00:00 для корректного сравнения дат

    this.dateResponseInvalid = Boolean(
      (this.data.dateResponse === null)
      || (new Date(this.data.dateResponse) < todayDate)
      || ((new Date(this.data.dateResponse) > new Date(this.data.dateDelivery)) && (this.data.dateDelivery !== null))
    );

    this.dateDeliveryInvalid = Boolean(
      (this.data.dateDelivery === null)
      || (new Date(this.data.dateDelivery) < todayDate)
      || ((new Date(this.data.dateDelivery) < new Date(this.data.dateResponse)) && (this.data.dateResponse !== null))
    );
  }


  updateAddressInvalidState() {
    this.addressInvalid = Boolean(this.data.address.length === 0);
  }

}
