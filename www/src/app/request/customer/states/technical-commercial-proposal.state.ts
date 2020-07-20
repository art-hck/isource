import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { finalize, map, tap } from "rxjs/operators";
import { TechnicalCommercialProposals } from "../actions/technical-commercial-proposal.actions";
import { patch, updateItem } from "@ngxs/store/operators";
import { StateStatus } from "../../common/models/state-status";
import { TechnicalCommercialProposalService } from "../services/technical-commercial-proposal.service";
import { Injectable } from "@angular/core";
import { TechnicalCommercialProposalByPosition } from "../../common/models/technical-commercial-proposal-by-position";
import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposalPositionStatus } from "../../common/enum/technical-commercial-proposal-position-status";
import Fetch = TechnicalCommercialProposals.Fetch;
import Approve = TechnicalCommercialProposals.Approve;
import Reject = TechnicalCommercialProposals.Reject;
import SendToEditMultiple = TechnicalCommercialProposals.SendToEditMultiple;
import ReviewMultiple = TechnicalCommercialProposals.ReviewMultiple;

export interface TechnicalCommercialProposalStateModel {
  proposals: TechnicalCommercialProposal[];
  status: StateStatus;
}

type Model = TechnicalCommercialProposalStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'CustomerTechnicalCommercialProposals',
  defaults: { proposals: null, status: "pristine" }
})
@Injectable()
export class TechnicalCommercialProposalState {
  cache: { [requestId in Uuid]: TechnicalCommercialProposal[] } = {};

  constructor(private rest: TechnicalCommercialProposalService) {}

  static proposalsByPos(status: TechnicalCommercialProposalPositionStatus[]) {
    return createSelector(
      [TechnicalCommercialProposalState],
      ({proposals}: Model) => proposals
        .reduce((group: TechnicalCommercialProposalByPosition[], proposal) => {
          proposal.positions.forEach(proposalPosition => {
            const item = group.find(({position}) => position.id === proposalPosition.position.id);
            if (item) {
              item.data.push({ proposal, proposalPosition });
            } else {
              group.push({ position: proposalPosition.position, data: [{ proposal, proposalPosition }] });
            }
          });
          return group;
        }, [])
        .filter(({data}) => data.every(({proposalPosition}) => status.includes(proposalPosition.status)))
    );
  }

  @Selector() static status({ status }: Model) { return status; }
  @Selector() static proposals({ proposals }: Model) { return proposals; }

  @Action(Fetch)
  fetch({ setState }: Context, { requestId }: Fetch) {
    // @TODO: Временно выпилил кеширование
    // if (this.cache[requestId]) {
    //   return ctx.setState(patch({proposals: this.cache[requestId]}));
    // }
    setState(patch({ proposals: null, status: "fetching" as StateStatus }));
    return this.rest.list(requestId)
      .pipe(
        tap(proposals => setState(patch({ proposals, status: "received" as StateStatus }))),
        tap(proposals => this.cache[requestId] = proposals),
      );
  }

  @Action(Approve)
  approve({ setState }: Context, { requestId, proposalPosition }: Approve) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.approve(requestId, proposalPosition).pipe(
      tap(proposal => setState(patch({ proposals: updateItem(({ id }) => proposal.id === id, proposal) }))),
      finalize(() => setState(patch({ status: "received" as StateStatus })))
    );
  }

  @Action(Reject)
  reject(ctx: Context, action: Reject) {
    ctx.setState(patch({ status: "updating" as StateStatus }));
    return this.rest.reject(action.requestId, action.position).pipe(
      finalize(() => ctx.setState(patch({ status: "received" as StateStatus })))
    );
  }

  @Action(SendToEditMultiple)
  sendToEditMultiple({ setState, getState }: Context, { requestPositions }: SendToEditMultiple) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.sendToEditMultiple(requestPositions.map(({ id }) => id)).pipe(
      tap(proposalPositions => proposalPositions.forEach(proposalPosition => setState(patch({
        proposals: updateItem(
          ({ positions }) => positions.some(({ id }) => proposalPosition.id === id),
          patch({ positions: updateItem(({ id }) => proposalPosition.id === id, proposalPosition) })
        ),
        status: "received" as StateStatus
      })))));
  }

  @Action(ReviewMultiple)
  reviewMultiple({ setState, getState }: Context, { proposalPositions, requestPositions }: ReviewMultiple) {
    setState(patch({ status: "updating" as StateStatus }));

    const data: { accepted: Uuid[], sendToEdit: Uuid[] } = {
      'accepted': proposalPositions.map(({ id }) => id),
      'sendToEdit': requestPositions.map(({ id }) => id)
    };

    return this.rest.reviewMultiple(data).pipe(
      tap(technicalProposalPositions => {
        setState(patch({ status: "updating" as StateStatus }));

        technicalProposalPositions.forEach(technicalProposalPosition => setState(patch(
          {
            proposals: updateItem(
              ({ positions }) => positions.some(({ id }) => technicalProposalPosition.id === id),
              patch({ positions: updateItem(({ id }) => technicalProposalPosition.id === id, technicalProposalPosition) })
            ),
            status: "received" as StateStatus
          }))
        );
      })
    );
  }
}
