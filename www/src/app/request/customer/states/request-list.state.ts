import { Action, Selector, State, StateContext } from "@ngxs/store";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { RequestService } from "../services/request.service";
import { flatMap, mapTo, tap } from "rxjs/operators";
import { patch } from "@ngxs/store/operators";
import { RequestListActions } from "../actions/request-list.actions";
import { Page } from "../../../core/models/page";
import { RequestsList } from "../../common/models/requests-list/requests-list";
import { RequestStatusCount } from "../../common/models/requests-list/request-status-count";
import { RequestActions } from "../actions/request.actions";
import { of } from "rxjs";
import Fetch = RequestListActions.Fetch;
import FetchStatusCounts = RequestListActions.FetchStatusCounts;
import AddRequestFromExcel = RequestListActions.AddRequestFromExcel;
import { Request } from "../../common/models/request";
import { Uuid } from "../../../cart/models/uuid";

export interface RequestStateStateModel {
  requests: Page<RequestsList>;
  createdRequestId: Uuid;
  requestStatusCounts: RequestStatusCount;
  status: StateStatus;
}

type Model = RequestStateStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'CustomerRequestList',
  defaults: { requests: null, requestStatusCounts: null, createdRequestId: null, status: "pristine" }
})
@Injectable()
export class RequestListState {
  constructor(private rest: RequestService) {}

  @Selector() static requests({requests}: Model) { return requests.entities; }
  @Selector() static totalCount({requests}: Model) { return requests.totalCount; }
  @Selector() static status({status}: Model) { return status; }
  @Selector() static statusCounts({requestStatusCounts}: Model) { return requestStatusCounts; }
  @Selector() static createdRequest({createdRequestId}: Model) { return createdRequestId; }

  @Action(Fetch, { cancelUncompleted: true }) fetch({setState}: Context, {startFrom, pageSize, filters}: Fetch) {
    setState(patch({ status: "fetching" as StateStatus }));
    return this.rest.getRequests(startFrom, pageSize, filters).pipe(
      tap(requests => setState(patch({requests, status: "received" as StateStatus}))),
    );
  }

  @Action(FetchStatusCounts) fetchStatusCounts({setState}: Context) {
    return this.rest.requestStatusCount().pipe(
      tap(requestStatusCounts => setState(patch({requestStatusCounts}))),
    );
  }

  @Action(AddRequestFromExcel) addRequestFromExcel({setState, dispatch}: Context, action: AddRequestFromExcel) {
    return this.rest.addRequestFromExcel(action.files, action.requestName).pipe(
      flatMap(({id}) => action.publish ? dispatch(new RequestActions.Publish(id, false)).pipe(mapTo(id)) : of(id)),
      tap(id => setState(patch({ createdRequestId: id }))),
    );
  }
}
