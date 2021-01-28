import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { StateStatus } from "../../common/models/state-status";
import { Request } from "../../common/models/request";
import { RequestPositionList } from "../../common/models/request-position-list";
import { Uuid } from "../../../cart/models/uuid";
import { RequestService } from "../../customer/services/request.service";
import { patch } from "@ngxs/store/operators";
import { switchMap, tap } from "rxjs/operators";
import { RequestActions } from "../actions/request.actions";
import Fetch = RequestActions.Fetch;
import Refresh = RequestActions.Refresh;
import FetchPositions = RequestActions.FetchPositions;
import RefreshPositions = RequestActions.RefreshPositions;
import ApprovePositions = RequestActions.ApprovePositions;
import RejectPositions = RequestActions.RejectPositions;

export interface RequestStateStateModel {
  request: Request;
  positions: RequestPositionList[];
  status: StateStatus;
  positionsStatus: StateStatus;
}

type Model = RequestStateStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'ApproverRequest',
  defaults: { request: null, positions: null, status: "pristine", positionsStatus: "pristine" }
})
@Injectable()
export class RequestState {
  cache: { [requestId in Uuid]: Request } = {};
  cachePositions: { [requestId in Uuid]: RequestPositionList[] } = {};

  constructor(private rest: RequestService) {
  }

  @Selector()
  static request({request}: Model) {
    return request;
  }

  @Selector()
  static positions({positions}: Model) {
    return positions;
  }

  @Selector()
  static status({status}: Model) {
    return status;
  }

  @Selector()
  static positionsStatus({positionsStatus}: Model) {
    return positionsStatus;
  }

  @Action(Fetch) fetch({setState}: Context, {requestId, useCache, clearState}: Fetch) {
    // @TODO: Временно выпилил кеширование
    // if (this.cache[requestId] && useCache) {
    //   return setState(patch({request: this.cache[requestId]}));
    // }

    if (clearState) {
      setState(patch({request: null, status: "fetching" as StateStatus}));
    }

    return this.rest.getRequest(requestId).pipe(
      tap(request => setState(patch({request, status: "received" as StateStatus}))),
      tap(request => this.cache[requestId] = request)
    );
  }

  @Action(Refresh) refresh({setState, dispatch}: Context, {requestId}: Refresh) {
    setState(patch({status: "updating" as StateStatus}));
    return dispatch(new Fetch(requestId, false, false));
  }

  @Action(FetchPositions) fetchPositions({setState}: Context, {requestId, filter, useCache, clearState}: FetchPositions) {
    // @TODO: Временно выпилил кеширование
    // if (this.cachePositions[requestId] && useCache) {
    //   return setState(patch({positions: this.cachePositions[requestId]}));
    // }

    if (clearState) {
      setState(patch({positions: null, positionsStatus: "fetching" as StateStatus}));
    }

    return this.rest.getRequestPositions(requestId, filter).pipe(
      tap(positions => setState(patch({positions, positionsStatus: "received" as StateStatus}))),
      tap(positions => this.cachePositions[requestId] = positions),
      tap(() => setState(patch({status: "received" as StateStatus})))
    );
  }

  @Action(RefreshPositions) refreshPositions({setState, dispatch}: Context, {requestId, filter}: RefreshPositions) {
    setState(patch({positionsStatus: "updating" as StateStatus}));
    return dispatch(new FetchPositions(requestId, filter, false, false));
  }

  @Action(ApprovePositions) approvePositions({setState, dispatch}: Context, {requestId, positionIds}: ApprovePositions) {
    setState(patch({status: "updating" as StateStatus}));
    return this.rest.approvePositions(requestId, positionIds).pipe(
      switchMap(() => dispatch([new Refresh(requestId), new RefreshPositions(requestId)]))
    );
  }

  @Action(RejectPositions) rejectPositions({setState, dispatch}: Context, {requestId, positionIds, rejectionMessage}: RejectPositions) {
    setState(patch({status: "updating" as StateStatus}));
    return this.rest.rejectPositions(requestId, positionIds, rejectionMessage).pipe(
      switchMap(() => dispatch([new Refresh(requestId), new RefreshPositions(requestId)]))
    );
  }
}
