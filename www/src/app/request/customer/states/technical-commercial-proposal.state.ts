import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { finalize, tap } from "rxjs/operators";
import { TechnicalCommercialProposals } from "../actions/technical-commercial-proposal.actions";
import { patch } from "@ngxs/store/operators";
import { StateStatus } from "../../common/models/state-status";
import { TechnicalCommercialProposalService } from "../services/technical-commercial-proposal.service";
import { Injectable } from "@angular/core";
import { TechnicalCommercialProposalGroupByPosition } from "../../common/models/technical-commercial-proposal-group-by-position";
import Fetch = TechnicalCommercialProposals.Fetch;
import Approve = TechnicalCommercialProposals.Approve;
import Reject = TechnicalCommercialProposals.Reject;

export interface TechnicalCommercialProposalStateModel {
  proposals: TechnicalCommercialProposal[];
  proposalsStateStatus: StateStatus;
}

type Context = StateContext<TechnicalCommercialProposalStateModel>;

@State<TechnicalCommercialProposalStateModel>({
  name: 'CustomerTechnicalCommercialProposals',
  defaults: { proposals: null, proposalsStateStatus: "pristine" }
})
@Injectable()
export class TechnicalCommercialProposalState {
  constructor(private rest: TechnicalCommercialProposalService) {
  }

  @Selector()
  static getSentToReview({ proposals }: TechnicalCommercialProposalStateModel) {
    return this.groupByPosition(proposals.filter(proposal => proposal.status === 'SENT_TO_REVIEW'));
  }

  @Selector()
  static getReviewed({ proposals }: TechnicalCommercialProposalStateModel) {
    return this.groupByPosition(proposals.filter(proposal => proposal.status === 'REVIEWED'));
  }

  @Selector()
  static status({ proposalsStateStatus }: TechnicalCommercialProposalStateModel) {
    return proposalsStateStatus;
  }

  static groupByPosition(proposals: TechnicalCommercialProposal[]): TechnicalCommercialProposalGroupByPosition[] {
    return proposals.reduce(
      (group: TechnicalCommercialProposalGroupByPosition[], proposal) => {
        proposal.positions.forEach(proposalPosition => {
          const item = group.find(_item => _item.position.id === proposalPosition.position.id);
          if (item) {
            item.data.push({ proposal, proposalPosition });
          } else {
            group.push({ position: proposalPosition.position, data: [{ proposal, proposalPosition }] });
          }
        });
        return group;
      }, []
    );
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

  @Action(Approve)
  approve(ctx: Context, action: Approve) {
    ctx.setState(patch({ proposalsStateStatus: "updating" as StateStatus }));
    return this.rest.approve(action.requestId, action.proposalPosition).pipe(
      finalize(() => ctx.setState(patch({ proposalsStateStatus: "received" as StateStatus }))
    ));
  }

  @Action(Reject)
  reject(ctx: Context, action: Reject) {
    ctx.setState(patch({ proposalsStateStatus: "updating" as StateStatus }));
    return this.rest.reject(action.requestId, action.position).pipe(tap(() =>
      ctx.setState(patch({ proposalsStateStatus: "received" as StateStatus }))
    ));
  }
}
