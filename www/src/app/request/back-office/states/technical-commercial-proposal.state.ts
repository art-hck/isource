import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { TechnicalCommercialProposalService } from "../services/technical-commercial-proposal.service";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { TechnicalCommercialProposals } from "../actions/technical-commercial-proposal.actions";
import { insertItem, patch, updateItem } from "@ngxs/store/operators";
import { TechnicalCommercialProposalPosition } from "../../common/models/technical-commercial-proposal-position";
import Publish = TechnicalCommercialProposals.Publish;
import Create = TechnicalCommercialProposals.Create;
import Fetch = TechnicalCommercialProposals.Fetch;
import FetchAvailablePositions = TechnicalCommercialProposals.FetchAvailablePositions;
import Update = TechnicalCommercialProposals.Update;
import { of, throwError } from "rxjs";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { RequestPosition } from "../../common/models/request-position";

export interface TechnicalCommercialProposalStateModel {
  proposals: TechnicalCommercialProposal[];
  proposalsStateStatus: StateStatus;
  availablePositions: RequestPosition[];
}

type Model = TechnicalCommercialProposalStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeTechnicalCommercialProposals',
  defaults: { proposals: null, availablePositions: null, proposalsStateStatus: "pristine" }
})
@Injectable()
export class TechnicalCommercialProposalState {
  constructor(private rest: TechnicalCommercialProposalService) {}

  @Selector()
  static getList({proposals}: Model) {
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
  static status({proposalsStateStatus}: Model) {
    return proposalsStateStatus;
  }

  @Action(Fetch)
  fetch(ctx: Context, { requestId }: Fetch) {
    if (ctx.getState().proposals) { return; }
    ctx.setState(patch({ proposalsStateStatus: "fetching" as StateStatus }));
    return this.rest.list(requestId)
      .pipe(tap(proposals => {
        ctx.setState(patch({ proposals, proposalsStateStatus: "received" as StateStatus }));
      }));
  }

  @Action(FetchAvailablePositions)
  fetchAvailablePositions({setState}: Context, {requestId}: FetchAvailablePositions) {
    return this.rest.availablePositions(requestId).pipe(
      tap(availablePositions => setState(patch({ availablePositions })))
    );
  }

  @Action(Create)
  create(ctx: Context, action: Create) {
    ctx.setState(patch({ proposalsStateStatus: "updating" as StateStatus }));
    return this.rest.create(action.requestId, action.payload).pipe(
      catchError(err => {
        ctx.setState(patch({ proposalsStateStatus: "error" as StateStatus }));
        return throwError(err);
      }),
      tap(proposal => ctx.setState(patch({
        proposals: insertItem(proposal),
        proposalsStateStatus: "received" as StateStatus
      }))),
      mergeMap(proposal => action.publish ? ctx.dispatch(new Publish(action.requestId, proposal)) : of(proposal))
  );
  }

  @Action(Update)
  update(ctx: Context, action: Update) {
    ctx.setState(patch({ proposalsStateStatus: "updating" as StateStatus }));
    return this.rest.update(action.requestId, action.payload).pipe(
      tap(proposal => ctx.setState(patch({
        proposals: updateItem<TechnicalCommercialProposal>(_proposal => _proposal.id === proposal.id, patch(proposal)),
        proposalsStateStatus: "received" as StateStatus
      }))),
      mergeMap(proposal => {
        if (action.publish) {
          return ctx.dispatch(new Publish(action.requestId, proposal));
        } else {
          return of(proposal);
        }
      }),
    );
  }

  @Action(Publish)
  publish({setState}: Context, {requestId, proposal}: Publish) {
    setState(patch({ proposalsStateStatus: "updating" as StateStatus }));
    return this.rest.publish(requestId, proposal).pipe(
      tap((_proposal) => setState(patch({
        proposals: updateItem<TechnicalCommercialProposal>(__proposal => __proposal.id === _proposal.id, patch(_proposal)),
        proposalsStateStatus: "received" as StateStatus
      })))
    );
  }
}
