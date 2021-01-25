import { State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { StateStatus } from "../../common/models/state-status";

export interface RequestStateStateModel {
  status: StateStatus;
}

type Model = RequestStateStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'ApproverRequest',
  defaults: { status: "pristine" }
})
@Injectable()
export class RequestState {
}
