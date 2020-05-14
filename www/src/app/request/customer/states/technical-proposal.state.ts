import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { finalize, tap } from "rxjs/operators";
import { TechnicalProposals } from "../actions/technical-proposal.actions";
import { patch } from "@ngxs/store/operators";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { Uuid } from "../../../cart/models/uuid";
import { TechnicalProposal } from "../../common/models/technical-proposal";
import { TechnicalProposalsStatus } from "../../common/enum/technical-proposals-status";
import { TechnicalProposalsService } from "../services/technical-proposals.service";

import Fetch = TechnicalProposals.Fetch;
import Update = TechnicalProposals.Update;
import Approve = TechnicalProposals.Approve;
import Reject = TechnicalProposals.Reject;

export interface TechnicalProposalStateModel {
  proposals: TechnicalProposal[];
  status: StateStatus;
}

type Model = TechnicalProposalStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'CustomerTechnicalProposals',
  defaults: { proposals: null, status: "pristine" }
})
@Injectable()
export class TechnicalProposalState {
  cache: { [requestId in Uuid]: TechnicalProposal[] } = {};

  constructor(private rest: TechnicalProposalsService) {}

  static proposalsByStatus(statuses: TechnicalProposalsStatus[]) {
    return createSelector(
      [TechnicalProposalState],
      ({proposals}: Model) => proposals
        .filter(proposal => statuses.indexOf(proposal.status) > -1)
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
    return this.rest.getTechnicalProposalsList(requestId)
      .pipe(tap(proposals => {
        setState(patch({ proposals, status: "received" as StateStatus }));
        this.cache[requestId] = proposals;
      }));
  }

  /**
   * Обновляет список ТП, не очищая перед этим предыдущий список в стейте
   * @param setState
   * @param requestId
   */
  @Action(Update)
  update({ setState }: Context, { requestId }: Fetch) {
    // @TODO: Временно выпилил кеширование
    // if (this.cache[requestId]) {
    //   return ctx.setState(patch({proposals: this.cache[requestId]}));
    // }
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.getTechnicalProposalsList(requestId)
      .pipe(tap(proposals => {
        setState(patch({ proposals, status: "received" as StateStatus }));
        this.cache[requestId] = proposals;
      }));
  }

  @Action(Approve)
  approve({ setState }: Context, { requestId, technicalProposalId, proposalPosition }: Approve) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.acceptTechnicalProposals(requestId, technicalProposalId, proposalPosition).pipe(
      finalize(() => setState(patch({ status: "received" as StateStatus })))
    );
  }

  @Action(Reject)
  reject({ setState }: Context, { requestId, technicalProposalId, proposalPosition }: Reject) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.declineTechnicalProposals(requestId, technicalProposalId, proposalPosition).pipe(
      finalize(() => setState(patch({ status: "received" as StateStatus })))
    );
  }
}
