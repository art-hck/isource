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
import { TechnicalCommercialProposalStatus } from "../../common/enum/technical-commercial-proposal-status";
import { TechnicalCommercialProposalPositionStatus } from "../../common/enum/technical-commercial-proposal-position-status";
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
        .filter(({data}) => data.every(({proposalPosition}) => ["NEW", "SENT_TO_REVIEW"].includes(proposalPosition.status)) === (status === "SENT_TO_REVIEW"))
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
        map(proposals => proposals.reduce((_proposals, proposal) => {
          [true, false].forEach(withAnalog => {
            const positions = proposal.positions.filter(({isAnalog}) => isAnalog === withAnalog);
            if (positions.length) {
              _proposals.push({ ...proposal, positions});
            }
          });

          return _proposals;
        }, [])),
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

  @Action(ApproveMultiple)
  approveMultiple({ setState, getState }: Context, { proposalPositions }: ApproveMultiple) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.approveMultiple(proposalPositions.map(({ id }) => id)).pipe(
      map((proposals) => [...proposals, ...getState().proposals
        // Если ТКП НЕ в списке на апрув, но содержит позиции которые есть в других ТКП на апрув
        .filter(({ positions }) => positions.some(p1 => proposalPositions.some((p2 => p1.id !== p2.id && p1.position.id === p2.position.id))))
        .map(proposal => {
          proposal.positions
            // Помечаем их как REJECTED
            .filter(({ position: p1 }) => proposalPositions.some((({ position: p2 }) => p1.id === p2.id)))
            .map(position => {
              position.status = TechnicalCommercialProposalPositionStatus.REJECTED;
              return position;
            });
          return proposal;
      })]),
      tap(proposals => proposals.forEach(proposal => setState(patch({
        proposals: updateItem(({ id }) => proposal.id === id, proposal),
        status: "received" as StateStatus
      })))),
    );
  }
}
