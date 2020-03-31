import { State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { StateStatus } from "../../request/common/models/state-status";

export interface TradeRequestStateModel {
  requests: [];
  status: StateStatus;
}

type Model = TradeRequestStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'Trade',
  defaults: { requests: null, status: "pristine" }
})
@Injectable()
export class KimPriceOrderState {
}
