import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { ProposalGroup } from "../../../common/models/proposal-group";
import { delayWhen, finalize, scan, shareReplay, switchMap, takeUntil, tap, throttleTime, withLatestFrom } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { TechnicalCommercialProposalService } from "../../services/technical-commercial-proposal.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import { UxgBreadcrumbsService, UxgModalComponent } from "uxg";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { Request } from "../../../common/models/request";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { FormBuilder, Validators } from "@angular/forms";
import { TechnicalCommercialProposalGroupFilter } from "../../../common/models/technical-commercial-proposal-group-filter";
import moment from "moment";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { ProcedureAction } from "../../models/procedure-action";
import { Procedure } from "../../models/procedure";
import { ProcedureSource } from "../../enum/procedure-source";
import { FeatureService } from "../../../../core/services/feature.service";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { RequestPosition } from "../../../common/models/request-position";
import FetchAvailablePositions = TechnicalCommercialProposals.FetchAvailablePositions;
import UploadTemplate = TechnicalCommercialProposals.UploadTemplate;
import FetchProcedures = TechnicalCommercialProposals.FetchProcedures;
import RefreshProcedures = TechnicalCommercialProposals.RefreshProcedures;
import DownloadTemplate = TechnicalCommercialProposals.DownloadTemplate;

@Component({
  selector: 'app-technical-commercial-proposal-group-view',
  templateUrl: './technical-commercial-proposal-group-view.component.html',
  styleUrls: ['technical-commercial-proposal-group-view.component.scss'],
})
export class TechnicalCommercialProposalGroupViewComponent implements OnInit {
  @ViewChild('uploadTemplateModal') uploadTemplateModal: UxgModalComponent;
  @Select(RequestState.request) request$: Observable<Request>;
  @Select(TechnicalCommercialProposalState.availablePositions) availablePositions$: Observable<RequestPosition[]>;
  @Select(TechnicalCommercialProposalState.procedures) procedures$: Observable<Procedure[]>;
  requestId: Uuid;
  procedureModalPayload: ProcedureAction & { procedure?: Procedure };
  editedGroup: ProposalGroup;
  files: File[] = [];
  destroy$ = new Subject();

  readonly procedureSource = ProcedureSource.TECHNICAL_COMMERCIAL_PROPOSAL;
  readonly newGroup$ = new BehaviorSubject<ProposalGroup>(null);
  readonly filter$ = new BehaviorSubject<TechnicalCommercialProposalGroupFilter>({});
  readonly form = this.fb.group({ requestPositionName: null, createdDateFrom: null, createdDateTo: null });
  readonly formTemplate = this.fb.group({
    technicalCommercialProposalGroupName: [null, [Validators.required]],
    fileTemplate: [null, [Validators.required]]
  });

  readonly tcpGroups$: Observable<ProposalGroup[]> = this.route.params.pipe(
    tap(({ id }) => this.requestId = id),
    delayWhen(({ id }) => this.store.dispatch([new RequestActions.Fetch(id), new FetchAvailablePositions(id), new FetchProcedures(id)])),
    withLatestFrom(this.request$),
    tap(([p, { id, number }]) => this.bc.breadcrumbs = [
      { label: "Заявки", link: "/requests/backoffice" },
      { label: `Заявка №${number}`, link: `/requests/backoffice/${id}` },
      { label: 'Согласование ТКП', link: `/requests/backoffice/${this.requestId}/technical-commercial-proposals`},
    ]),
    switchMap(() => this.filter$),
    switchMap((filter) => this.service.groupList(this.requestId, filter)),
    switchMap(groups => this.newGroup$.pipe(
      tap(g => g && this.store.dispatch(new FetchAvailablePositions(this.requestId))),
      scan((acc, group) => {
      if (group) {
        const i = acc.findIndex(({id}) => group?.id === id);
        i !== -1 ? acc[i] = group : acc.push(group);
      }

      return acc;
    }, groups))),
    shareReplay(1)
  );

  readonly updateProcedures = () => [new RefreshProcedures(this.requestId), new FetchAvailablePositions(this.requestId)];
  readonly downloadTemplate = (requestId: Uuid) => new DownloadTemplate(requestId);
  readonly uploadTemplate = (requestId: Uuid, groupId: Uuid, files: File[], groupName: string) => new UploadTemplate(requestId, groupId, files, groupName);

  constructor(
    private bc: UxgBreadcrumbsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private actions: Actions,
    public featureService: FeatureService,
    public store: Store,
    public service: TechnicalCommercialProposalService
  ) {}

  filter(filter: TechnicalCommercialProposalGroupFilter) {
    this.filter$.next({
      ...filter,
      createdDateFrom: filter.createdDateFrom ? moment(filter.createdDateFrom, 'DD.MM.YYYY').format('YYYY-MM-DD') : null,
      createdDateTo: filter.createdDateTo ? moment(filter.createdDateTo, 'DD.MM.YYYY').format('YYYY-MM-DD') : null
    });
  }

  ngOnInit() {
    this.actions.pipe(
      ofActionCompleted(UploadTemplate),
      throttleTime(1),
      takeUntil(this.destroy$)
    ).subscribe(({result}) => {
      const e = result.error as any;
      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) :
        new ToastActions.Success(`Группа ТКП успешно сохранена`));
      if (!e) { this.updateTechnicalCommercialProposalGroups(); }
    });
  }

  onChangeFilesList(files: File[]): void {
    this.formTemplate.get('fileTemplate').setValue(files);
  }

  updateTechnicalCommercialProposalGroups(): void {
    this.service.groupList(this.requestId).subscribe(groups => {
      groups.forEach(tcpGroup => this.newGroup$.next(tcpGroup));
    });
  }

  submit() {
    if (this.formTemplate.valid) {
      this.uploadTemplateModal.close();
      this.store.dispatch(
        this.uploadTemplate(
          this.requestId,
          null,
          this.formTemplate.get('fileTemplate').value,
          this.formTemplate.get('technicalCommercialProposalGroupName').value
        )
      ).pipe(finalize(() => this.store.dispatch(new FetchAvailablePositions(this.requestId)))).subscribe();
    }
  }

  trackById = (i, { id }: TechnicalCommercialProposal | Procedure) => id;
}
