import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { TechnicalCommercialProposalService } from "../services/technical-commercial-proposal.service";
import { map, mergeMap, tap } from "rxjs/operators";
import { TechnicalCommercialProposals } from "../actions/technical-commercial-proposal.actions";
import { insertItem, patch, updateItem } from "@ngxs/store/operators";
import { TechnicalCommercialProposalPosition } from "../../common/models/technical-commercial-proposal-position";
import Publish = TechnicalCommercialProposals.Publish;
import Create = TechnicalCommercialProposals.Create;
import Fetch = TechnicalCommercialProposals.Fetch;
import FetchAvailablePositions = TechnicalCommercialProposals.FetchAvailablePositions;
import Update = TechnicalCommercialProposals.Update;
import { of } from "rxjs";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";

export interface TechnicalCommercialProposalStateModel {
  proposals: TechnicalCommercialProposal[];
  proposalsStateStatus: StateStatus;
  availablePositions: TechnicalCommercialProposalPosition[];
}

type Context = StateContext<TechnicalCommercialProposalStateModel>;

@State<TechnicalCommercialProposalStateModel>({
  name: 'BackofficeTechnicalCommercialProposals',
  defaults: { proposals: null, availablePositions: null, proposalsStateStatus: "pristine" }
})
@Injectable()
export class TechnicalCommercialProposalState {
  constructor(private rest: TechnicalCommercialProposalService) {}

  @Selector()
  static getList({proposals}: TechnicalCommercialProposalStateModel) {
    return proposals;
  }

  @Selector()
  static availablePositions({availablePositions}: TechnicalCommercialProposalStateModel) {
    return availablePositions;
  }

  @Selector()
  static status({proposalsStateStatus}: TechnicalCommercialProposalStateModel) {
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
      map(positions => positions.map(position => ({
        position,
        manufacturingName: null,
        priceWithVat: null,
        currency: null,
        quantity: null,
        measureUnit: null,
        deliveryDate: null,
      }))),
      tap(availablePositions => setState(patch({ availablePositions })))
    );
  }

  @Action(Create)
  create(ctx: Context, action: Create) {
    ctx.setState(patch({ proposalsStateStatus: "updating" as StateStatus }));
    return this.rest.create(action.requestId, action.payload).pipe(
      tap(proposal => ctx.setState(patch({
        proposals: insertItem(proposal),
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
