import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { concatAll, finalize, tap } from "rxjs/operators";
import { TechnicalCommercialProposals } from "../actions/technical-commercial-proposal.actions";
import { patch, updateItem } from "@ngxs/store/operators";
import { StateStatus } from "../../common/models/state-status";
import { TechnicalCommercialProposalService } from "../services/technical-commercial-proposal.service";
import { Injectable } from "@angular/core";
import { TechnicalCommercialProposalByPosition } from "../../common/models/technical-commercial-proposal-by-position";
import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposalStatus } from "../../common/enum/technical-commercial-proposal-status";
import { from } from "rxjs";
import Fetch = TechnicalCommercialProposals.Fetch;
import Approve = TechnicalCommercialProposals.Approve;
import Reject = TechnicalCommercialProposals.Reject;
import ApproveMultiple = TechnicalCommercialProposals.ApproveMultiple;

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

  static proposalsByPos(status: TechnicalCommercialProposalStatus) {
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
        .filter(({data}) => data.every(({proposalPosition}) => proposalPosition.status === "NEW") === (status === "SENT_TO_REVIEW"))
    );
  }

  @Selector() static status({ status }: Model) { return status; }
  @Selector() static proposals({ proposals }: Model) { return proposals; }

  @Action(Fetch)
  fetch(ctx: Context, { requestId }: Fetch) {
    // @TODO: Временно выпилил кеширование
    // if (this.cache[requestId]) {
    //   return ctx.setState(patch({proposals: this.cache[requestId]}));
    // }
    ctx.setState(patch({ proposals: null, status: "fetching" as StateStatus }));
    return this.rest.list(requestId)
      .pipe(tap(proposals => {
        ctx.setState(patch({ proposals, status: "received" as StateStatus }));
        this.cache[requestId] = proposals;
      }));
  }

  @Action(Approve)
  approve(ctx: Context, action: Approve) {
    ctx.setState(patch({ status: "updating" as StateStatus }));
    return this.rest.approve(action.requestId, action.proposalPosition).pipe(
      tap(proposal => ctx.setState(patch({ proposals: updateItem(({ id }) => proposal.id === id, proposal) }))),
      finalize(() => ctx.setState(patch({ status: "received" as StateStatus })))
    );
  }

  @Action(Reject)
  reject(ctx: Context, action: Reject) {
    ctx.setState(patch({ status: "updating" as StateStatus }));
    return this.rest.reject(action.requestId, action.position).pipe(
      finalize(() => ctx.setState(patch({ status: "received" as StateStatus })))
    );
  }

  @Action(ApproveMultiple)
  approveMultiple(ctx: Context, action: ApproveMultiple) {
    ctx.setState(patch({ status: "updating" as StateStatus }));
    return from(action.proposalPositions.map(pos => this.rest.approve(action.requestId, pos))).pipe(
      concatAll(),
      tap(proposal => ctx.setState(patch({ proposals: updateItem(({ id }) => proposal.id === id, proposal) }))),
      finalize(() => ctx.setState(patch({ status: "received" as StateStatus })))
    );
  }
}
