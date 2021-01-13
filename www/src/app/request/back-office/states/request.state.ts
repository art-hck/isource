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
import AttachDocuments = RequestActions.AttachDocuments;
import UploadFromTemplate = RequestActions.UploadFromTemplate;
import { ToastActions } from "../../../shared/actions/toast.actions";
import EditRequestName = RequestActions.EditRequestName;
import ChangeResponsibleUser = RequestActions.ChangeResponsibleUser;
import ChangeResponsibleUserPositions = RequestActions.ChangeResponsibleUserPositions;

export interface RequestStateStateModel {
  request: Request;
  positions: RequestPositionList[];
  status: StateStatus;
  positionsStatus: StateStatus;
}

type Model = RequestStateStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeRequest',
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
      tap(positions => this.cachePositions[requestId] = positions)
    );
  }

  @Action(RefreshPositions) refreshPositions({setState, dispatch}: Context, {requestId}: RefreshPositions) {
    setState(patch({ positionsStatus: "updating" as StateStatus }));
    return dispatch(new FetchPositions(requestId, false, false));
  }

  @Action(Publish) publish({setState, dispatch}: Context, {requestId, positions, refresh}: Publish) {
    return this.rest.publishRequest(requestId, positions).pipe(
      switchMap(() => dispatch(refresh ? [new Refresh(requestId), new RefreshPositions(requestId)] : []))
    );
  }

  @Action(ChangeResponsibleUser)
  changeResponsibleUser({ setState, dispatch }: Context, { requestId, userId }: ChangeResponsibleUser) {
    return this.rest.changeResponsibleUser(requestId, userId).pipe(
      switchMap(() => dispatch([new Refresh(requestId), new RefreshPositions(requestId)]))
    );
  }

  @Action(ChangeResponsibleUserPositions)
  changeResponsibleUserPositions({ setState, dispatch }: Context, { requestId, userId, positionIds }: ChangeResponsibleUserPositions) {
    return this.rest.changeResponsibleUserPositions(requestId, userId, positionIds).pipe(
      switchMap(() => dispatch([new Refresh(requestId), new RefreshPositions(requestId)]))
    );
  }

  @Action(AttachDocuments) attachDocuments({setState, dispatch}: Context, {requestId, positionIds, files}: AttachDocuments) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.attachDocuments(requestId, positionIds, files).pipe(
      tap(() => setState(patch({ status: "received" as StateStatus})))
    );
  }

  @Action(EditRequestName) editRequestName({setState, dispatch}: Context, {requestId, requestName}: EditRequestName) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.editRequestName(requestId, requestName).pipe(
      switchMap(() => dispatch([new Refresh(requestId)])),
    );
  }

  @Action(UploadFromTemplate) uploadFromTemplate(ctx: Context, {requestId, files}: UploadFromTemplate) {
    return this.rest.addPositionsFromExcel(requestId, files).pipe(
      catchError(e => ctx.dispatch(new ToastActions.Error('Ошибка в шаблоне ' + (e && e.error && e.error.detail || "")))),
      switchMap(() => ctx.dispatch([new RefreshPositions(requestId), new Refresh(requestId)]))
    );
  }
}
