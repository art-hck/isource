import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { StateStatus } from "../../common/models/state-status";
import { Page } from "../../../core/models/page";
import { RequestsList } from "../../common/models/requests-list/requests-list";
import { RequestStatusCount } from "../../common/models/requests-list/request-status-count";
import { patch } from "@ngxs/store/operators";
import { tap } from "rxjs/operators";
import { RequestListActions } from "../actions/request-list.actions";
import Fetch = RequestListActions.Fetch;
import { RequestService } from "../services/request.service";

export interface RequestStateStateModel {
  requests: Page<RequestsList>;
  requestStatusCounts: RequestStatusCount;
  status: StateStatus;
}

type Model = RequestStateStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'ApproverRequestList',
  defaults: { requests: null, requestStatusCounts: null, status: "pristine" }
})
@Injectable()
export class RequestListState {

  constructor(private rest: RequestService) {}
  @Selector() static requests({requests}: Model) { return requests.entities; }
  @Selector() static statusCounters({requests}: Model) { return requests.statusCounters; }
  @Selector() static totalCount({requests}: Model) { return Object.values(requests.statusCounters).reduce((acc, curr) => acc += curr, 0); }
  @Selector() static tabTotalCount({requests}: Model) { return requests.totalCount; }
  @Selector() static status({status}: Model) { return status; }

  @Action(Fetch, { cancelUncompleted: true }) fetch({setState}: Context, {startFrom, pageSize, filters, sort}: Fetch) {
    setState(patch({ status: "fetching" as StateStatus }));
    return this.rest.list(startFrom, pageSize, filters, sort).pipe(
      tap(requests => setState(patch({requests, status: "received" as StateStatus}))),
    );
  }
}
