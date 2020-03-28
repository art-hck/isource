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
import { RequestPositionService } from "../../common/services/request-position.service";
import { ToastActions } from "../../../shared/actions/toast.actions";

export interface RequestStateStateModel {
  request: Request;
  positions: RequestPositionList[];
  status: StateStatus;
}

type Model = RequestStateStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeRequest',
  defaults: { request: null, positions: null, status: "pristine" }
})
@Injectable()
export class RequestState {
  cache: { [reqeustId in Uuid]: Request } = {};
  cachePositions: { [reqeustId in Uuid]: RequestPositionList[] } = {};
  constructor(private rest: RequestService) {}

  @Selector() static request({request}: Model) { return request; }
  @Selector() static positions({positions}: Model) { return positions; }
  @Selector() static status({status}: Model) { return status; }

  @Action(Fetch) fetch({setState}: Context, {requestId, useCache, resetState}: Fetch) {
    if (this.cache[requestId] && useCache) {
      return setState(patch({request: this.cache[requestId]}));
    }

    if (resetState) {
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

  @Action(FetchPositions) fetchPositions({setState}: Context, {requestId, useCache, resetState}: FetchPositions) {
    if (this.cachePositions[requestId] && useCache) {
      return setState(patch({positions: this.cachePositions[requestId]}));
    }

    if (resetState) {
      setState(patch({ positions: null, status: "fetching" as StateStatus }));
    }

    return this.rest.getRequestPositions(requestId).pipe(
      tap(positions => setState(patch({positions, status: "received" as StateStatus }))),
      tap(positions => this.cachePositions[requestId] = positions)
    );
  }

  @Action(RefreshPositions) refreshPositions({setState, dispatch}: Context, {requestId}: RefreshPositions) {
    setState(patch({ status: "updating" as StateStatus }));
    return dispatch(new FetchPositions(requestId, false, false));
  }

  @Action(Publish) publish({setState, dispatch}: Context, {requestId, refresh}: Publish) {
    return this.rest.publishRequest(requestId).pipe(
      switchMap(() => dispatch(refresh ? [new Refresh(requestId), new RefreshPositions(requestId)] : []))
    );
  }

  @Action(UploadFromTemplate) uploadFromTemplate(ctx: Context, {requestId, files}: UploadFromTemplate) {
    return this.rest.addPositionsFromExcel(requestId, files).pipe(
      catchError(e => ctx.dispatch(new ToastActions.Error('Ошибка в шаблоне ' + (e && e.error && e.error.detail || "")))),
      switchMap(() => ctx.dispatch(new RefreshPositions(requestId)))
    );
  }
}
