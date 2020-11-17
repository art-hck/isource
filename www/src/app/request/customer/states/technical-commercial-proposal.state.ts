import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Action, createSelector, Selector, State, StateContext } from "@ngxs/store";
import { finalize, tap } from "rxjs/operators";
import { TechnicalCommercialProposals } from "../actions/technical-commercial-proposal.actions";
import { patch, updateItem } from "@ngxs/store/operators";
import { saveAs } from 'file-saver/src/FileSaver';
import { StateStatus } from "../../common/models/state-status";
import { TechnicalCommercialProposalService } from "../services/technical-commercial-proposal.service";
import { Injectable } from "@angular/core";
import { TechnicalCommercialProposalByPosition } from "../../common/models/technical-commercial-proposal-by-position";
import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposalPositionStatus } from "../../common/enum/technical-commercial-proposal-position-status";
import Fetch = TechnicalCommercialProposals.Fetch;
import Reject = TechnicalCommercialProposals.Reject;
import SendToEditMultiple = TechnicalCommercialProposals.SendToEditMultiple;
import ReviewMultiple = TechnicalCommercialProposals.ReviewMultiple;
import DownloadAnalyticalReport = TechnicalCommercialProposals.DownloadAnalyticalReport;
import { CommonProposal, CommonProposalByPosition, CommonProposalItem, CommonProposalItemStatus } from "../../common/models/common-proposal";
import { RequestPosition } from "../../common/models/request-position";

export interface TechnicalCommercialProposalStateModel {
  positions: RequestPosition[];
  proposals: CommonProposal[];
  status: StateStatus;
}

type Model = TechnicalCommercialProposalStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'CustomerTechnicalCommercialProposals',
  defaults: { proposals: null, positions: null, status: "pristine" }
})
@Injectable()
export class TechnicalCommercialProposalState {

  constructor(private rest: TechnicalCommercialProposalService) {}

  static proposalsByPos(status: CommonProposalItemStatus[]) {
    return createSelector(
      [TechnicalCommercialProposalState],
      ({ proposals, positions }: Model) => proposals
        .reduce((acc: CommonProposalByPosition[], proposal) => {
          proposal.items.forEach(item => {
            const proposalByPosition = acc.find(({ position: { id } }) => item.requestPositionId === id);
            if (proposalByPosition) {
              proposalByPosition.items.push(item);
            } else {
              const position = positions.find(({ id }) => item.requestPositionId === id);
              acc.push({ position, items: [item] });
            }
          });
          return acc;
        }, [])
        .filter(({ items }) => items.every((item) => status.includes(item.status)))
    );
  }

  @Selector() static status({ status }: Model) { return status; }
  @Selector() static proposals({ proposals }: Model) { return proposals; }

  @Action(Fetch)
  fetch({ setState }: Context, { requestId, groupId }: Fetch) {
    setState(patch<Model>({ proposals: null, status: "fetching" }));
    return this.rest.list(requestId, { requestTechnicalCommercialProposalGroupId: groupId }).pipe(
      tap(({ proposals, positions }) => setState(patch<Model>({ proposals, positions, status: "received" })))
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

  @Action(DownloadAnalyticalReport)
  downloadAnalyticalReport(ctx: Context, { requestId, groupId }: DownloadAnalyticalReport) {
    return this.rest.downloadAnalyticalReport(requestId, groupId).pipe(
      tap((data) => saveAs(data, `Аналитическая справка.xlsx`))
    );
  }
}
