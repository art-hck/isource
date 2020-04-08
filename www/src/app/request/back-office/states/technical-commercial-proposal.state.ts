import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { TechnicalCommercialProposalService } from "../services/technical-commercial-proposal.service";
import { catchError, mergeMap, tap } from "rxjs/operators";
import { TechnicalCommercialProposals } from "../actions/technical-commercial-proposal.actions";
import { append, insertItem, patch, updateItem } from "@ngxs/store/operators";
import { of, throwError } from "rxjs";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { RequestPosition } from "../../common/models/request-position";
import { Uuid } from "../../../cart/models/uuid";
import Publish = TechnicalCommercialProposals.Publish;
import Create = TechnicalCommercialProposals.Create;
import Fetch = TechnicalCommercialProposals.Fetch;
import FetchAvailablePositions = TechnicalCommercialProposals.FetchAvailablePositions;
import Update = TechnicalCommercialProposals.Update;
import UploadTkpFromTemplate = TechnicalCommercialProposals.UploadTkpFromTemplate;
import DownloadTemplate = TechnicalCommercialProposals.DownloadTemplate;
import { saveAs } from 'file-saver/src/FileSaver';

export interface TechnicalCommercialProposalStateModel {
  proposals: TechnicalCommercialProposal[];
  status: StateStatus;
  availablePositions: RequestPosition[];
}

type Model = TechnicalCommercialProposalStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeTechnicalCommercialProposals',
  defaults: {proposals: null, availablePositions: null, status: "pristine"}
})
@Injectable()
export class TechnicalCommercialProposalState {
  cache: { [reqeustId in Uuid]: TechnicalCommercialProposal[] } = {};

  constructor(private rest: TechnicalCommercialProposalService) {
  }

  @Selector()
  static proposals({proposals}: Model) {
    return proposals;
  }

  @Selector()
  static proposalsLength({proposals}: Model) {
    return proposals.length;
  }

  @Selector()
  static availablePositions({availablePositions}: Model) {
    return availablePositions;
  }

  @Selector()
  static status({status}: Model) {
    return status;
  }

  @Action(Fetch)
  fetch(ctx: Context, {requestId}: Fetch) {
    // Временно выпилил кеш
    // if (this.cache[requestId]) {
    //   return ctx.setState(patch({proposals: this.cache[requestId]}));
    // }
    ctx.setState(patch({proposals: null, status: "fetching" as StateStatus}));
    return this.rest.list(requestId)
      .pipe(tap(proposals => {
        ctx.setState(patch({proposals, status: "received" as StateStatus}));
        this.cache[requestId] = proposals;
      }));
  }

  @Action(FetchAvailablePositions)
  fetchAvailablePositions({setState}: Context, {requestId}: FetchAvailablePositions) {
    setState(patch({availablePositions: null}));
    return this.rest.availablePositions(requestId).pipe(
      tap(availablePositions => setState(patch({availablePositions})))
    );
  }

  @Action(Create)
  create(ctx: Context, action: Create) {
    ctx.setState(patch({status: "updating" as StateStatus}));
    return this.rest.create(action.requestId, action.payload).pipe(
      catchError(err => {
        ctx.setState(patch({status: "error" as StateStatus}));
        return throwError(err);
      }),
      tap(proposal => ctx.setState(patch({
        proposals: insertItem(proposal),
        status: "received" as StateStatus
      }))),
      mergeMap(proposal => action.publish ? ctx.dispatch(new Publish(proposal)) : of(proposal))
    );
  }

  @Action(Update)
  update(ctx: Context, {publish, payload}: Update) {
    ctx.setState(patch({status: "updating" as StateStatus}));
    return this.rest.update(payload).pipe(
      tap(proposal => ctx.setState(patch({
        proposals: updateItem<TechnicalCommercialProposal>(_proposal => _proposal.id === proposal.id, patch(proposal)),
        status: "received" as StateStatus
      }))),
      mergeMap(proposal => {
        if (publish) {
          return ctx.dispatch(new Publish(proposal));
        } else {
          return of(proposal);
        }
      }),
    );
  }

  @Action(Publish)
  publish({setState}: Context, {proposal}: Publish) {
    setState(patch({status: "updating" as StateStatus}));
    return this.rest.publish(proposal).pipe(
      tap((_proposal) => setState(patch({
        proposals: updateItem<TechnicalCommercialProposal>(__proposal => __proposal.id === _proposal.id, patch(_proposal)),
        status: "received" as StateStatus
      })))
    );
  }

  @Action(DownloadTemplate)
  downloadTemplate(ctx: Context, {requestId}: DownloadTemplate) {
    return this.rest.downloadTemplate(requestId).pipe(
      tap((data) => saveAs(data, `RequestTechnicalCommercialProposalsTemplate.xlsx`))
    );
  }

  @Action(UploadTkpFromTemplate)
  uploadTkpFromTemplate(ctx: Context, {requestId, files}: UploadTkpFromTemplate) {
    ctx.setState(patch({status: "updating" as StateStatus}));
    return this.rest.uploadTemplate(requestId, files).pipe(
      catchError(err => {
        ctx.setState(patch({status: "error" as StateStatus}));
        return throwError(err);
      }),
      tap(proposals => ctx.setState(patch({
        proposals: [...proposals, ...ctx.getState().proposals],
        status: "received" as StateStatus
      }))),
    );
  }
}
