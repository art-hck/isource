import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { StateStatus } from "../../../request/common/models/state-status";
import { patch } from "@ngxs/store/operators";
import { tap } from "rxjs/operators";
import { KimPriceOrderService } from "../services/kim-price-order.service";
import { KimPriceOrderProposals } from "../../common/models/kim-price-order-proposals";
import { PriceOrderProposalsActions } from "../actions/price-order-proposals.actions";
import Fetch = PriceOrderProposalsActions.Fetch;

export interface KimCustomerPriceOrderProposalsStateModel {
  proposals: KimPriceOrderProposals;
  status: StateStatus;
}

type Model = KimCustomerPriceOrderProposalsStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'KimCustomerPriceOrderProposals',
  defaults: { proposals: null, status: "pristine" }
})
@Injectable()
export class PriceOrderProposalsState {

  static positionsWithProposals(hasWinner: boolean = null) {
    return createSelector(
      [PriceOrderProposalsState], ({proposals}: Model) => proposals.data.filter(
        ({ proposalPositions: p }) => hasWinner === null || hasWinner ? p.some(({isWinner}) => isWinner) : p.every(({isWinner}) => !isWinner)
      )
    );
  }

  @Selector() static priceOrder({ proposals }: Model) { return proposals; }
  @Selector() static proposalsLength({ proposals }: Model) { return proposals.data.length; }
  @Selector() static status({ status }: Model) { return status; }

  constructor(private rest: KimPriceOrderService) {}

  @Action(Fetch)
  fetch({ setState }: Context, { priceOrderId }: Fetch) {
    setState(patch({ status: "fetching" } as Model));

    return this.rest.proposals(priceOrderId).pipe(
      tap(proposals => setState(patch({proposals, status: "received"} as Model))),
    );
  }
}
