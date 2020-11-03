import { Action, Selector, State, StateContext } from "@ngxs/store";
import { switchMap, tap } from "rxjs/operators";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { RequestPosition } from "../../common/models/request-position";
import { Uuid } from "../../../cart/models/uuid";
import { saveAs } from 'file-saver/src/FileSaver';
import { CommercialProposal } from "../../common/models/commercial-proposal";
import { CommercialProposalsService } from "../services/commercial-proposals.service";
import { CommercialProposalsActions } from "../actions/commercial-proposal.actions";
import { insertItem, patch, updateItem } from "@ngxs/store/operators";
import { Procedure } from "../models/procedure";
import { ProcedureSource } from "../enum/procedure-source";
import { ProcedureService } from "../services/procedure.service";
import { ToastActions } from "../../../shared/actions/toast.actions";
import { SupplierCommercialProposalInfo } from "../models/supplier-commercial-proposal-info";
import { CommercialProposalInfo } from "../models/commercial-proposal-info";
import DownloadAnalyticalReport = CommercialProposalsActions.DownloadAnalyticalReport;
import Fetch = CommercialProposalsActions.Fetch;
import DownloadTemplate = CommercialProposalsActions.DownloadTemplate;
import UploadTemplate = CommercialProposalsActions.UploadTemplate;
import Refresh = CommercialProposalsActions.Refresh;
import PublishPositions = CommercialProposalsActions.PublishPositions;
import FetchProcedures = CommercialProposalsActions.FetchProcedures;
import RefreshProcedures = CommercialProposalsActions.RefreshProcedures;
import AddSupplier = CommercialProposalsActions.AddSupplier;
import SaveProposal = CommercialProposalsActions.SaveProposal;
import Rollback = CommercialProposalsActions.Rollback;
import FetchAvailablePositions = CommercialProposalsActions.FetchAvailablePositions;

export interface CommercialProposalStateModel {
  availablePositions: RequestPosition[];
  positions: RequestPosition[];
  suppliers: SupplierCommercialProposalInfo[];
  requestOffers: CommercialProposalInfo[];
  procedures: Procedure[];
  status: StateStatus;
}

type Model = CommercialProposalStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'BackofficeCommercialProposals',
  defaults: { positions: null, availablePositions: null, suppliers: null, requestOffers: null, procedures: null, status: "pristine" }
})
@Injectable()
export class CommercialProposalState {
  cache: { [requestId in Uuid]: CommercialProposal[] } = {};

  constructor(
    private rest: CommercialProposalsService,
    private procedureService: ProcedureService,
  ) {
  }

  @Selector() static commercialProposals({ suppliers, positions }: Model) { return { suppliers, positions }; }
  @Selector() static positions({ positions }: Model) { return positions; }
  @Selector() static availablePositions({ availablePositions }: Model) { return availablePositions; }
  @Selector() static suppliers({ suppliers }: Model) { return suppliers; }
  @Selector() static requestOffers({ requestOffers }: Model) { return requestOffers; }
  @Selector() static procedures({ procedures }: Model) { return procedures; }
  @Selector() static positionsLength({ positions }: Model) { return positions.length; }
  @Selector() static status({ status }: Model) { return status; }

  @Action([Fetch, Refresh])
  fetch({ setState, dispatch }: Context, { update, requestId, groupId }: Fetch) {
    if (update) {
      setState(patch({ status: "updating" } as Model));
    } else {
      setState(patch({ positions: null, suppliers: null, status: "fetching" } as Model));
    }

    return this.rest.getOffers(requestId, groupId).pipe(
      tap(({positions = [], suppliers = [], requestOffers = []}) => setState(patch({ positions, requestOffers, suppliers } as Model))),
      switchMap(() => dispatch( update ? new RefreshProcedures(requestId, groupId) : new FetchProcedures(requestId, groupId))),
      tap(() => setState(patch({ status: "received" } as Model))),
    );
  }

  @Action([FetchAvailablePositions])
  fetchAvailablePositions({ setState }: Context, { requestId }: FetchAvailablePositions) {
    return this.rest.availablePositions(requestId).pipe(tap(availablePositions => setState(patch({ availablePositions }))));
  }

  @Action([FetchProcedures, RefreshProcedures])
  fetchProcedures({ setState }: Context, { update, requestId, groupId }: FetchProcedures) {
    if (update) {
      setState(patch({ status: "updating" } as Model));
    } else {
      setState(patch({ procedures: null, status: "fetching" } as Model));
    }

    return this.procedureService.list(requestId, ProcedureSource.COMMERCIAL_PROPOSAL, groupId).pipe(
      tap(procedures => setState(patch({ procedures, status: "received" } as Model))),
    );
  }

  @Action(AddSupplier)
  addSupplier({ setState, dispatch }: Context, { requestId, groupId, supplierId }: AddSupplier) {
    setState(patch({ status: "updating" } as Model));

    return this.rest.addSupplier(requestId, groupId, supplierId).pipe(
      tap(suppliers => setState(patch({suppliers, status: "received"} as Model)))
    );
  }

  @Action(SaveProposal)
  savedProposal({ setState, dispatch }: Context, { requestId, positionId, proposal }: SaveProposal) {
    setState(patch({ status: "updating" } as Model));
    return (proposal.id ? this.rest.editOffer(requestId, positionId, proposal) : this.rest.addOffer(requestId, positionId, proposal))
      .pipe(tap(_proposal => setState(patch({
        positions: updateItem(({ id }) => id === positionId, patch({
          linkedOffers: proposal.id ? updateItem(({ id }) => id === proposal.id, _proposal) : insertItem(_proposal)
        })),
        status: "received" as StateStatus
      }))));
  }

  @Action(PublishPositions)
  publishPositions({ setState, dispatch }: Context, { requestId, groupId, positions }: PublishPositions) {
    setState(patch({ status: "updating" } as Model));
    return this.rest.publishRequestOffers(requestId, positions).pipe(tap(() => dispatch(new Refresh(requestId, groupId))));
  }

  @Action(Rollback)
  rollback({ setState, dispatch }: Context, { requestId, positionId }: Rollback) {
    setState(patch({ status: "updating" } as Model));
    return this.rest.rollback(requestId, positionId).pipe(
      tap(position => setState(patch({
        positions: updateItem(({id}) => positionId === id, position),
        status: "received" as StateStatus
      })))
    );
  }

  @Action(DownloadAnalyticalReport)
  downloadAnalyticalReport(ctx: Context, { requestId, groupId }: DownloadAnalyticalReport) {
    return this.rest.downloadAnalyticalReport(requestId, groupId).pipe(
      tap((data) => saveAs(data, `Аналитическая справка.xlsx`))
    );
  }

  @Action(DownloadTemplate)
  downloadTemplate(ctx: Context, { requestId, groupId }: DownloadTemplate) {
    return this.rest.downloadTemplate(requestId, groupId).pipe(
      tap((data) => saveAs(data, `RequestOffersTemplate.xlsx`))
    );
  }

  @Action(UploadTemplate)
  uploadTemplate({ setState, dispatch }: Context, { requestId, files, groupId, groupName }: UploadTemplate) {
    setState(patch({ status: "updating" } as Model));

    const uploadTemplate = this.rest.uploadTemplate(requestId, files, groupId, groupName).pipe(tap(
      () => dispatch([new Refresh(requestId, groupId), new ToastActions.Success("Шаблон импортирован")]),
      () => dispatch(new Refresh(requestId, groupId)))
    );

    const uploadTemplateFromGroups = this.rest.uploadTemplateFromGroups(requestId, files, groupName);

    return groupId ? uploadTemplate : uploadTemplateFromGroups;
  }
}
