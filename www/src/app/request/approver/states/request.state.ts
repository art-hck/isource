import { State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";

export interface RequestStateStateModel {
}

type Model = RequestStateStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'ApproverRequest',
  defaults: {  }
})
@Injectable()
export class RequestState {
}
