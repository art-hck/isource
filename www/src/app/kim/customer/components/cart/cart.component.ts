import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { StateStatus } from "../../../../request/common/models/state-status";
import { CartState } from "../../states/cart.state";
import { CartActions } from "../../actions/cart.actions";
import Fetch = CartActions.Fetch;
import { KimPriceOrderPosition } from "../../../common/models/kim-price-order-position";

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit {
  @Select(CartState.cartItems) cartItems$: Observable<KimPriceOrderPosition[]>;
  @Select(CartState.status) status$: Observable<StateStatus>;
  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new Fetch());
  }
}
