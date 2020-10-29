import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { CommercialProposal } from "../../common/models/commercial-proposal";
import { CommercialProposalsService } from "../services/commercial-proposals.service";
import { CommercialProposals } from "../actions/commercial-proposal.actions";
import { patch } from "@ngxs/store/operators";
import { switchMap, tap } from "rxjs/operators";
import { RequestPosition } from "../../common/models/request-position";
import { PositionStatus } from "../../common/enum/position-status";
import { SupplierCommercialProposalInfo } from "../../back-office/models/supplier-commercial-proposal-info";
import { CommercialProposalsStatus } from "../../common/enum/commercial-proposals-status";
import Fetch = CommercialProposals.Fetch;
import Update = CommercialProposals.Update;
import Review = CommercialProposals.Review;

export interface CommercialProposalStateModel {
  positions: RequestPosition[];
  suppliers: SupplierCommercialProposalInfo[];
  status: StateStatus;
}

type Model = CommercialProposalStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'CustomerCommercialProposals',
  defaults: { positions: null, suppliers: null, status: "pristine" }
})
@Injectable()
export class CommercialProposalState {
  cache: { [requestId in Uuid]: CommercialProposal[] } = {};

  constructor(private rest: CommercialProposalsService) {}

  static proposalsByPos(status: PositionStatus | CommercialProposalsStatus) {
    return createSelector(
      [CommercialProposalState],
      ({ positions }: Model) => positions.filter(
        position => position.status === status || position.linkedOffers.some((p) => p.status === status)
      )
    );
  }

  @Selector() static proposalsByPosHasWinner({ positions }: Model) {
    return positions.filter(
      position => position.linkedOffers.some(p => p.isWinner)
    );
  }

  @Selector() static status({ status }: Model) { return status; }
  @Selector() static suppliers({ suppliers }: Model) { return suppliers; }
  @Selector() static positionsLength({ positions }: Model) { return positions.length; }


  @Action([Fetch, Update]) fetch({setState}: Context, {requestId, update}: Fetch) {
    if (update) {
      setState(patch({ status: "updating" as StateStatus }));
    } else {
      setState(patch({ request: null, suppliers: null, status: "fetching" as StateStatus }));
    }

    return this.rest.positionsWithOffers(requestId).pipe(
      tap(({positions, suppliers}) => setState(patch({positions, suppliers, status: "received" as StateStatus}))),
    );
  }

  @Action(Review)
  review({ setState, dispatch }: Context, { requestId, body }: Review) {
    setState(patch({ status: "updating" as StateStatus }));

    return this.rest.review(requestId, body).pipe(switchMap(() => dispatch(new Update(requestId))));
  }
}
