import { StateStatus } from "../../../request/common/models/state-status";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { patch } from "@ngxs/store/operators";
import { catchError, tap } from "rxjs/operators";
import { KimCartItem } from "../../common/models/kim-cart-item";
import { CartActions } from "../actions/cart.actions";
import Fetch = CartActions.Fetch;
import { KimCartService } from "../services/kim-cart.service";

export interface CartStateModel {
  cartItems: KimCartItem[];
  status: StateStatus;
}

type Model = CartStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'Cart',
  defaults: { cartItems: null, status: "pristine" }
})
@Injectable()
export class CartState {
  @Selector() static cartItems({cartItems}: Model) { return cartItems; }
  @Selector() static status({ status }: Model) { return status; }

  constructor(private rest: KimCartService) {}

  @Action(Fetch)
  list({setState}: Context, action: Fetch) {
    setState(patch({ status: "fetching" as StateStatus }));

    return this.rest.list().pipe(
      tap(cartItems => setState(patch({ cartItems, status: "received" as StateStatus } )))
    );
  }
}
