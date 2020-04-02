import { State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { StateStatus } from "../../../request/common/models/state-status";

export interface KimRequestStateModel {
  requests: [];
  status: StateStatus;
}

type Model = KimRequestStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'Kim',
  defaults: { requests: null, status: "pristine" }
})
@Injectable()
export class KimPriceOrderState {
}
