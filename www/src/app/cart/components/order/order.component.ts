import { Component, OnInit, Input } from '@angular/core';
import { CartStoreService } from '../../services/cart-store.service';
import { OrderFormInfo } from '../../models/order-form-info';
import { Router } from '@angular/router';
import { CartService } from "../../services/cart.service";

@Component({
  selector: 'cart-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  protected deliveryDateInvalid = false;
  protected deliveryBasisInvalid = false;
  protected paymentTermsInvalid = false;
  protected data: OrderFormInfo;

  constructor(
    protected cartStore: CartStoreService,
    protected cart: CartService,
    protected router: Router
  ) {
    this.data = new OrderFormInfo({});
  }

  ngOnInit() {
  }

  set deliveryDate(value: Date|null) {
    this.data.deliveryDate = value;
    this.updateDateFieldInvalidState();
  }

  get deliveryDate(): Date|null {
    return this.data.deliveryDate;
  }

  set isDeliveryDateAsap(value: boolean) {
    this.data.isDeliveryDateAsap = value;
    this.updateDateFieldInvalidState();
  }

  get isDeliveryDateAsap(): boolean {
    return this.data.isDeliveryDateAsap;
  }

  set deliveryBasis(value: string) {
    this.data.deliveryBasis = value;
    this.updateDeliveryBasisInvalidState();
  }

  get deliveryBasis(): string {
    return this.data.deliveryBasis;
  }

  set paymentTerms(value: string) {
    this.data.paymentTerms = value;
    this.updatePaymentTermsInvalidState();
  }

  get paymentTerms(): string {
    return this.data.paymentTerms;
  }

  onSubmitOrder() {
    this.updateDateFieldInvalidState();
    this.updateDeliveryBasisInvalidState();
    this.updatePaymentTermsInvalidState();
    if (this.deliveryDateInvalid || this.deliveryBasisInvalid || this.paymentTermsInvalid) {
      return;
    }

    this.cart.sendOrder(this.data).subscribe((data: any) => {
      this.cartStore.clear();
      this.router.navigateByUrl(`requests/customer/${data.id}`);
    });
  }

  protected updateDateFieldInvalidState() {
    const todayDate = new Date(); // Получаем текущую дату (включая время)
    todayDate.setHours(0, 0, 0, 0); // Сбрасываем часы, минуты и секунды до 00:00:00 для корректного сравнения дат

    let isInvalid = false;
    if (!this.data.isDeliveryDateAsap) {
      if (this.data.deliveryDate === null) {
        isInvalid = true;
      } else if ((new Date(this.data.deliveryDate)) < todayDate) {
        isInvalid = true;
      }
    }

    this.deliveryDateInvalid = isInvalid;
  }

  protected updateDeliveryBasisInvalidState() {
    this.deliveryBasisInvalid = Boolean(this.data.deliveryBasis.length === 0);
  }

  protected updatePaymentTermsInvalidState() {
    this.paymentTermsInvalid = Boolean(this.data.paymentTerms.length === 0);
  }

}
