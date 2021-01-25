import { State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";

export interface PositionStateStateModel {
}

type Model = PositionStateStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'ApproverPosition',
  defaults: { }
})
@Injectable()
export class PositionState {
}
