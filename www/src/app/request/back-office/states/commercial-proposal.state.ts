import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs/operators";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { RequestPosition } from "../../common/models/request-position";
import { Uuid } from "../../../cart/models/uuid";
import { saveAs } from 'file-saver/src/FileSaver';
import {CommercialProposal} from "../../common/models/commercial-proposal";
import {CommercialProposalsService} from "../services/commercial-proposals.service";
import {CommercialProposalsActions} from "../actions/commercial-proposal.actions";
import DownloadAnalyticalReport = CommercialProposalsActions.DownloadAnalyticalReport;
import { ContragentList } from "../../../contragent/models/contragent-list";
import Fetch = CommercialProposalsActions.Fetch;
import { patch } from "@ngxs/store/operators";
import DownloadTemplate = CommercialProposalsActions.DownloadTemplate;
import UploadTemplate = CommercialProposalsActions.UploadTemplate;
import Update = CommercialProposalsActions.Update;
import PublishPositions = CommercialProposalsActions.PublishPositions;

export interface CommercialProposalStateModel {
  positions: RequestPosition[];
  suppliers: ContragentList[];
  status: StateStatus;
}

type Model = CommercialProposalStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeCommercialProposals',
  defaults: { positions: null, suppliers: null, status: "pristine" }
})
@Injectable()
export class CommercialProposalState {
  cache: { [requestId in Uuid]: CommercialProposal[] } = {};

  constructor(private rest: CommercialProposalsService) {
  }

  @Selector() static positions({ positions }: Model) { return positions; }
  @Selector() static suppliers({ suppliers }: Model) { return suppliers; }
  @Selector() static positionsLength({ positions }: Model) { return positions.length; }
  @Selector() static status({ status }: Model) { return status; }

  @Action([Fetch, Update])
  fetch({ setState }: Context, { update, requestId }: Fetch) {
    if (update) {
      setState(patch({ status: "updating" } as Model));
    } else {
      setState(patch({ positions: null, suppliers: null, status: "fetching" } as Model));
    }

    return this.rest.getOffers(requestId).pipe(
      tap(({positions, suppliers}) => setState({ positions, suppliers, status: "received" }))
    );
  }

  @Action(PublishPositions)
  publishPositions(ctx: Context, { requestId, positions }: PublishPositions) {
    return this.rest.publishRequestOffers(requestId, positions).pipe(tap(() => ctx.dispatch(new Update(requestId))));
  }

  @Action(DownloadAnalyticalReport)
  downloadAnalyticalReport(ctx: Context, { requestId }: DownloadAnalyticalReport) {
    return this.rest.downloadAnalyticalReport(requestId).pipe(
      tap((data) => saveAs(data, `Аналитическая справка.xlsx`))
    );
  }

  @Action(DownloadTemplate)
  downloadTemplate(ctx: Context, { request }: DownloadTemplate) {
    return this.rest.downloadTemplate(request).pipe(
      tap((data) => saveAs(data, `Request${request.number}OffersTemplate.xlsx`))
    );
  }

  @Action(UploadTemplate)
  uploadTemplate(ctx: Context, { requestId, files }: UploadTemplate) {
    return this.rest.addOffersFromExcel(requestId, files).pipe(tap(() => ctx.dispatch(new Update(requestId))));
  }
}
