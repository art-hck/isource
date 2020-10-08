import { Action, Selector, State, StateContext } from "@ngxs/store";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { Request } from "../../common/models/request";
import { RequestActions } from "../actions/request.actions";
import { RequestService } from "../services/request.service";
import { catchError, switchMap, tap } from "rxjs/operators";
import { patch } from "@ngxs/store/operators";
import { Uuid } from "../../../cart/models/uuid";
import { RequestPositionList } from "../../common/models/request-position-list";
import Fetch = RequestActions.Fetch;
import Publish = RequestActions.Publish;
import FetchPositions = RequestActions.FetchPositions;
import RefreshPositions = RequestActions.RefreshPositions;
import Refresh = RequestActions.Refresh;
import UploadFromTemplate = RequestActions.UploadFromTemplate;
import { ToastActions } from "../../../shared/actions/toast.actions";
import Approve = RequestActions.Approve;
import Reject = RequestActions.Reject;
import PublishPositions = RequestActions.PublishPositions;
import ApprovePositions = RequestActions.ApprovePositions;
import RejectPositions = RequestActions.RejectPositions;
import CreateTemplate = RequestActions.CreateTemplate;

export interface RequestStateStateModel {
  request: Request;
  positions: RequestPositionList[];
  status: StateStatus;
  positionsStatus: StateStatus;
}

type Model = RequestStateStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'CustomerRequest',
  defaults: { request: null, positions: null, status: "pristine", positionsStatus: "pristine" }
})
@Injectable()
export class RequestState {
  cache: { [requestId in Uuid]: Request } = {};
  cachePositions: { [requestId in Uuid]: RequestPositionList[] } = {};
  constructor(private rest: RequestService) {}

  @Selector() static request({request}: Model) { return request; }
  @Selector() static positions({positions}: Model) { return positions; }
  @Selector() static status({status}: Model) { return status; }
  @Selector() static positionsStatus({positionsStatus}: Model) { return positionsStatus; }

  @Action(Fetch) fetch({setState}: Context, {requestId, useCache, clearState}: Fetch) {
    // @TODO: Временно выпилил кеширование
    // if (this.cache[requestId] && useCache) {
    //   return setState(patch({request: this.cache[requestId]}));
    // }

    if (clearState) {
      setState(patch({ request: null, status: "fetching" as StateStatus }));
    }

    return this.rest.getRequest(requestId).pipe(
      tap(request => setState(patch({request, status: "received" as StateStatus}))),
      tap(request => this.cache[requestId] = request)
    );
  }

  @Action(Refresh) refresh({setState, dispatch}: Context, {requestId}: Refresh) {
    setState(patch({ status: "updating" as StateStatus }));
    return dispatch(new Fetch(requestId, false, false));
  }

  @Action(FetchPositions) fetchPositions({setState}: Context, {requestId, useCache, clearState}: FetchPositions) {
    // @TODO: Временно выпилил кеширование
    // if (this.cachePositions[requestId] && useCache) {
    //   return setState(patch({positions: this.cachePositions[requestId]}));
    // }

    if (clearState) {
      setState(patch({ positions: null, positionsStatus: "fetching" as StateStatus }));
    }

    return this.rest.getRequestPositions(requestId).pipe(
      tap(positions => setState(patch({positions, positionsStatus: "received" as StateStatus }))),
      tap(positions => this.cachePositions[requestId] = positions),
      tap(() => setState(patch({ status: "received" as StateStatus})))
    );
  }

  @Action(RefreshPositions) refreshPositions({setState, dispatch}: Context, {requestId}: RefreshPositions) {
    setState(patch({ positionsStatus: "updating" as StateStatus }));
    return dispatch(new FetchPositions(requestId, false, false));
  }

  @Action(Publish) publish({setState, dispatch}: Context, {requestId, refresh}: Publish) {
    return this.rest.publishRequest(requestId).pipe(
      switchMap(() => dispatch(refresh ? [new Refresh(requestId), new RefreshPositions(requestId)] : []))
    );
  }

  @Action(Approve) approve({setState, dispatch}: Context, {requestId}: Approve) {
    return this.rest.approveRequest(requestId).pipe(
      switchMap(() => dispatch([new Refresh(requestId), new RefreshPositions(requestId)]))
    );
  }

  @Action(Reject) reject({setState, dispatch}: Context, {requestId}: Reject) {
    return this.rest.rejectRequest(requestId, "").pipe(
      switchMap(() => dispatch( [new Refresh(requestId), new RefreshPositions(requestId)]))
    );
  }

  @Action(PublishPositions) publishPositions({setState, dispatch}: Context, {requestId, positionIds}: PublishPositions) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.publishPositions(requestId, positionIds).pipe(
      switchMap(() => dispatch([new Refresh(requestId), new RefreshPositions(requestId)]))
    );
  }

  @Action(ApprovePositions) approvePositions({setState, dispatch}: Context, {requestId, positionIds}: ApprovePositions) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.approvePositions(requestId, positionIds).pipe(
      switchMap(() => dispatch([new Refresh(requestId), new RefreshPositions(requestId)]))
    );
  }

  @Action(RejectPositions) rejectPositions({setState, dispatch}: Context, {requestId, positionIds, rejectionMessage}: RejectPositions) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.rejectPositions(requestId, positionIds, rejectionMessage).pipe(
      switchMap(() => dispatch([new Refresh(requestId), new RefreshPositions(requestId)]))
    );
  }

  @Action(UploadFromTemplate) uploadFromTemplate(ctx: Context, {requestId, files}: UploadFromTemplate) {
    return this.rest.addPositionsFromExcel(requestId, files).pipe(
      catchError(e => ctx.dispatch(new ToastActions.Error('Ошибка в шаблоне ' + (e && e.error && e.error.detail || "")))),
      switchMap(() => ctx.dispatch(new RefreshPositions(requestId)))
    );
  }

  @Action(CreateTemplate) createTemplate({setState, dispatch}: Context, {requestId, positions, title, tag}: CreateTemplate) {
    return this.rest.createTemplate(requestId,  positions, title, tag).pipe(
      tap(request => setState(patch({request, status: "received" as StateStatus}))
      ));
  }
}
