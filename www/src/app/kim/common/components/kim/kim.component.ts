import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { Select, Store } from "@ngxs/store";
import { CartState } from "../../../customer/states/cart.state";
import { Observable } from "rxjs";
import { KimCartItem } from "../../models/kim-cart-item";
import { StateStatus } from "../../../../request/common/models/state-status";
import { CartActions } from "../../../customer/actions/cart.actions";

@Component({
  templateUrl: './kim.component.html',
  styleUrls: ['./kim.component.scss']
})
export class KimComponent implements AfterViewInit, OnDestroy {
  @Select(CartState.cartItems) cartItems$: Observable<KimCartItem[]>;
  @Select(CartState.cartItemsLength) cartItemsLength$: Observable<number>;
  @Select(CartState.status) status$: Observable<StateStatus>;

  @ViewChild('menu') menu: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document,
              public store: Store) {
  }

  ngAfterViewInit() {
    this.document.querySelector('.app-scroll').insertBefore(
      this.menu.nativeElement,
      this.document.querySelector('.app-content')
    );
    this.store.dispatch(new CartActions.Fetch());
  }

  ngOnDestroy() {
    this.menu.nativeElement.remove();
  }

}
