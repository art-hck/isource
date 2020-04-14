import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { TechnicalCommercialProposals } from "../actions/technical-commercial-proposal.actions";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { RequestPosition } from "../../common/models/request-position";
import { Uuid } from "../../../cart/models/uuid";
import DownloadAnalyticalReport = TechnicalCommercialProposals.DownloadAnalyticalReport;
import { saveAs } from 'file-saver/src/FileSaver';
import {CommercialProposal} from "../../common/models/commercial-proposal";
import {CommercialProposalsService} from "../services/commercial-proposals.service";

export interface CommercialProposalStateModel {
  proposals: CommercialProposal[];
  status: StateStatus;
  availablePositions: RequestPosition[];
}

type Model = CommercialProposalStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeCommercialProposals',
  defaults: { proposals: null, availablePositions: null, status: "pristine" }
})
@Injectable()
export class TechnicalCommercialProposalState {
  cache: { [requestId in Uuid]: TechnicalCommercialProposal[] } = {};

  constructor(private rest: CommercialProposalsService) {
  }

  @Selector() static proposals({ proposals }: Model) { return proposals; }
  @Selector() static proposalsLength({ proposals }: Model) { return proposals.length; }
  @Selector() static availablePositions({ availablePositions }: Model) { return availablePositions; }
  @Selector() static status({ status }: Model) { return status; }

  @Action(DownloadAnalyticalReport)
  downloadAnalyticalReport(ctx: Context, { requestId }: DownloadAnalyticalReport) {
    return this.rest.downloadAnalyticalReport(requestId).pipe(
      tap((data) => saveAs(data, `Аналитическая справка.xlsx`))
    );
  }
}
