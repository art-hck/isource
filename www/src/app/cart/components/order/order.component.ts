import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartStoreService } from '../../services/cart-store.service';
import { OrderFormInfo } from '../../models/order-form-info';
import { Router } from '@angular/router';
import { CartService } from "../../services/cart.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "../../../shared/forms/custom.validators";
import { Subscription } from "rxjs";
import { ClrLoadingState } from "@clr/angular";

@Component({
  selector: 'cart-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

  private subscription = new Subscription();
  public loadingState = ClrLoadingState.DEFAULT;
  public form = new FormGroup({
    'requestName': new FormControl('', [Validators.required]),
    'deliveryDate': new FormControl(null, CustomValidators.futureDate()),
    'isDeliveryDateAsap': new FormControl(false),
    'deliveryBasis': new FormControl(null, [Validators.required]),
    'paymentTerms': new FormControl('30 банковских дней по факту поставки', [Validators.required, Validators.minLength(1)]),
  });

  constructor(
    private cartStore: CartStoreService,
    private cart: CartService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.form.get('isDeliveryDateAsap').valueChanges.subscribe(checked => {
      this.form.get('deliveryDate').reset();
      if (checked) {
        this.form.get('deliveryDate').disable();
      } else {
        this.form.get('deliveryDate').enable();
      }
    });
  }

  isQuantityInvalid(): boolean {
    return this.cartStore.getItems().filter(item => item.quantity <= 0).length > 0;
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const orderFormInfo = new OrderFormInfo(this.form.value);
    this.loadingState = ClrLoadingState.LOADING;
    this.subscription.add(
      this.cart.sendOrder(orderFormInfo)
        .subscribe(data => {
          this.cartStore.clear();
          this.loadingState = ClrLoadingState.SUCCESS;
          this.router.navigateByUrl(`requests/customer/${data.id}`);
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
