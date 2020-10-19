import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { Action, Selector, State, StateContext, StateOperator } from "@ngxs/store";
import { TechnicalCommercialProposalService } from "../services/technical-commercial-proposal.service";
import { catchError, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { TechnicalCommercialProposals } from "../actions/technical-commercial-proposal.actions";
import { insertItem, patch, updateItem } from "@ngxs/store/operators";
import { of, throwError } from "rxjs";
import { StateStatus } from "../../common/models/state-status";
import { Injectable } from "@angular/core";
import { RequestPosition } from "../../common/models/request-position";
import { Uuid } from "../../../cart/models/uuid";
import { saveAs } from 'file-saver/src/FileSaver';
import { TechnicalCommercialProposalByPosition } from "../../common/models/technical-commercial-proposal-by-position";
import { Procedure } from "../models/procedure";
import { ProcedureService } from "../services/procedure.service";
import { ProcedureSource } from "../enum/procedure-source";
import Publish = TechnicalCommercialProposals.Publish;
import Create = TechnicalCommercialProposals.Create;
import Fetch = TechnicalCommercialProposals.Fetch;
import FetchAvailablePositions = TechnicalCommercialProposals.FetchAvailablePositions;
import Update = TechnicalCommercialProposals.Update;
import UploadTemplate = TechnicalCommercialProposals.UploadTemplate;
import DownloadTemplate = TechnicalCommercialProposals.DownloadTemplate;
import DownloadAnalyticalReport = TechnicalCommercialProposals.DownloadAnalyticalReport;
import PublishByPosition = TechnicalCommercialProposals.PublishByPosition;
import CreateContragent = TechnicalCommercialProposals.CreateContragent;
import CreatePosition = TechnicalCommercialProposals.CreatePosition;
import FetchProcedures = TechnicalCommercialProposals.FetchProcedures;
import RefreshProcedures = TechnicalCommercialProposals.RefreshProcedures;
import Rollback = TechnicalCommercialProposals.Rollback;
import UpdateParams = TechnicalCommercialProposals.UpdateParams;

export interface TechnicalCommercialProposalStateModel {
  proposals: TechnicalCommercialProposal[];
  status: StateStatus;
  procedures: Procedure[];
  availablePositions: RequestPosition[];
}

type Model = TechnicalCommercialProposalStateModel;
type Context = StateContext<Model>;

function insertOrUpdateProposals(proposals: TechnicalCommercialProposal[]): StateOperator<Model> {
  return (state: Readonly<Model>) => ({
    ...state,
    status: "received",
    proposals: proposals.reduce((updatedProposals, proposal) => {
      const i = updatedProposals.findIndex(({ id }) => id === proposal.id);
      i < 0 ? updatedProposals.push(proposal) : updatedProposals[i] = proposal;
      return updatedProposals;
    }, state.proposals)
  });
}

@State<Model>({
  name: 'BackofficeTechnicalCommercialProposals',
  defaults: { proposals: null, availablePositions: null, procedures: null, status: "pristine" }
})
@Injectable()
export class TechnicalCommercialProposalState {
  cache: { [requestId in Uuid]: TechnicalCommercialProposal[] } = {};

  constructor(private rest: TechnicalCommercialProposalService, private procedureService: ProcedureService) {
  }

  @Selector()
  static proposals({ proposals }: Model) { return proposals; }

  @Selector()
  static availablePositions({ availablePositions }: Model) { return availablePositions; }

  @Selector()
  static status({ status }: Model) { return status; }

  @Selector()
  static procedures({ procedures }: Model) { return procedures; }

  @Selector()
  static proposalsByPositions({ proposals, availablePositions }: Model) {
    // Перегруппировываем ТКП попозиционно, включаем позиции по которым еще не создано ни одного ТКП
    return proposals.reduce((group: TechnicalCommercialProposalByPosition[], proposal) => {
      proposal.positions.forEach(proposalPosition => {
        const item = group.find(({ position: { id } }) => proposalPosition.position.id === id);
        if (item) {
          item.data.push({ proposal, proposalPosition });
        } else {
          group.push({ position: proposalPosition.position, data: [{ proposal, proposalPosition }] });
        }
      });
      return group;
    }, availablePositions?.map(p => ({ position: p, data: [] })) || []);
  }

  @Action(Fetch)
  fetch(ctx: Context, { requestId, groupId }: Fetch) {
    // Временно выпилил кеш
    // if (this.cache[requestId]) {
    //   return ctx.setState(patch({proposals: this.cache[requestId]}));
    // }
    ctx.setState(patch({ proposals: null, status: "fetching" as StateStatus }));
    return this.rest.list(requestId, { requestTechnicalCommercialProposalGroupId: groupId }).pipe(
      tap(proposals => ctx.setState(patch({ proposals }))),
      tap(proposals => this.cache[requestId] = proposals),
      switchMap(() => ctx.dispatch(new FetchProcedures(requestId, groupId))),
      tap(() => ctx.setState(patch({ status: "received" as StateStatus }))),
    );
  }

  @Action(FetchAvailablePositions)
  fetchAvailablePositions({ setState }: Context, { requestId, groupId }: FetchAvailablePositions) {
    setState(patch({ availablePositions: null }));
    return this.rest.availablePositions(requestId, groupId).pipe(
      tap(availablePositions => setState(patch({ availablePositions })))
    );
  }

  @Action([FetchProcedures, RefreshProcedures])
  fetchProcedures({ setState }: Context, { requestId, groupId, update }: FetchProcedures) {
    if (update) {
      setState(patch({ status: "updating" as StateStatus }));
    } else {
      setState(patch({ procedures: null, status: "fetching" as StateStatus }));
    }

    return this.procedureService.list(requestId, ProcedureSource.TECHNICAL_COMMERCIAL_PROPOSAL, groupId).pipe(
      tap(procedures => setState(patch({ procedures }))),
      tap(() => {
        if (update) {
          setState(patch({ status: "received" as StateStatus }));
        }
      }),
    );
  }

  @Action([Create, CreateContragent])
  create(ctx: Context, { publish, payload, requestId, groupId }: Create) {
    ctx.setState(patch({ status: "updating" as StateStatus }));
    return this.rest.create(requestId, groupId, payload).pipe(
      catchError(err => {
        ctx.setState(patch({ status: "error" as StateStatus }));
        return throwError(err);
      }),
      tap(proposal => ctx.setState(patch({
        proposals: insertItem(proposal),
        status: "received" as StateStatus
      }))),
      mergeMap(proposal => publish ? ctx.dispatch(new Publish(proposal)) : of(proposal))
    );
  }

  @Action([Update, CreatePosition])
  update(ctx: Context, { publish, payload }: Update) {
    ctx.setState(patch({ status: "updating" as StateStatus }));
    return this.rest.update(payload).pipe(
      tap(proposal => ctx.setState(patch({
        proposals: updateItem<TechnicalCommercialProposal>(_proposal => _proposal.id === proposal.id, patch(proposal)),
        status: "received" as StateStatus
      }))),
      mergeMap(proposal => {
        if (publish) {
          return ctx.dispatch(new Publish(proposal));
        } else {
          return of(proposal);
        }
      }),
    );
  }

  @Action(UpdateParams)
  updateParams(ctx: Context, action: UpdateParams) {
    ctx.setState(patch({ status: "updating" as StateStatus }));
    return this.rest.updateParams(action.requestId, action.payload).pipe(
      tap(proposal => ctx.setState(patch({
        proposals: updateItem<TechnicalCommercialProposal>(_proposal => _proposal.id === proposal.id, patch(proposal)),
        status: "received" as StateStatus
      })))
    );
  }

  @Action(Publish)
  publish({ setState }: Context, { proposal }: Publish) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.publish(proposal).pipe(
      tap((_proposal) => setState(patch({
        proposals: updateItem<TechnicalCommercialProposal>(__proposal => __proposal.id === _proposal.id, patch(_proposal)),
        status: "received" as StateStatus
      })))
    );
  }

  @Action(PublishByPosition)
  publishPositions({ setState }: Context, { proposalsByPositions }: PublishByPosition) {
    setState(patch({ status: "updating" as StateStatus }));
    return this.rest.publishPositions(
      proposalsByPositions.reduce((ids, { data }) => [...ids, ...data.map(({ proposalPosition: { id } }) => id)], [])
    ).pipe(
      tap(proposalPositions => proposalPositions.forEach(proposalPosition => setState(patch({
        proposals: updateItem(({ positions }) => positions.some(({ id }) => proposalPosition.id === id), patch({
          positions: updateItem(({ id }) => proposalPosition.id === id, proposalPosition)
        })),
        availablePositions: updateItem(({ id }) => proposalPosition.position.id === id, proposalPosition.position),
        status: "received" as StateStatus,
      }))))
    );
  }

  @Action(DownloadTemplate)
  downloadTemplate(ctx: Context, { requestId, groupId }: DownloadTemplate) {
    return this.rest.downloadTemplate(requestId, groupId).pipe(
      tap((data) => saveAs(data, `RequestTechnicalCommercialProposalsTemplate.xlsx`))
    );
  }

  @Action(UploadTemplate)
  uploadTemplate(ctx: Context, { requestId, groupId, files, groupName }: UploadTemplate) {
    ctx.setState(patch({ status: "updating" as StateStatus }));

    const uploadTemplate = this.rest.uploadTemplate(requestId, groupId, files, groupName).pipe(
      catchError(err => {
        ctx.setState(patch({ status: "error" as StateStatus }));
        return throwError(err);
      }),
      tap(proposals => ctx.setState(insertOrUpdateProposals(proposals))),
    );

    const uploadTemplateFromGroups = this.rest.uploadTemplateFromGroups(requestId, groupId, files, groupName).pipe(
      catchError(err => {
        ctx.setState(patch({ status: "error" as StateStatus }));
        return throwError(err);
      })
    );

    return groupId ? uploadTemplate : uploadTemplateFromGroups;
  }

  @Action(DownloadAnalyticalReport)
  downloadAnalyticalReport(ctx: Context, { requestId, groupId }: DownloadAnalyticalReport) {
    return this.rest.downloadAnalyticalReport(requestId, groupId).pipe(
      tap((data) => saveAs(data, `Аналитическая справка.xlsx`))
    );
  }

  @Action(Rollback)
  rollback({ setState, dispatch }: Context, { requestId, positionId }: Rollback) {
    setState(patch({ status: "updating" } as Model));
    return this.rest.rollback(requestId, positionId).pipe(
      tap(proposalPositions => {
        proposalPositions.forEach(proposalPosition => {
          setState(patch({
            proposals: updateItem(({ positions }) => positions.some(({ id }) => id === proposalPosition.id),
              patch({
                positions: updateItem(({ id }) => id === proposalPosition.id, proposalPosition)
              })
            ),
            availablePositions: updateItem(({ id }) => proposalPosition.position.id === id, proposalPosition.position)
          }));
        });
        setState(patch({ status: "received" } as Model));
      })
    );
  }
}
