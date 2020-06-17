import { ActivatedRoute, Router } from "@angular/router";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { filter, switchMap, takeUntil, tap, throttleTime } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService, UxgPopoverComponent } from "uxg";
import { FeatureService } from "../../../../core/services/feature.service";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { RequestPosition } from "../../../common/models/request-position";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { animate, style, transition, trigger } from "@angular/animations";
import { TechnicalCommercialProposalByPosition } from "../../../common/models/technical-commercial-proposal-by-position";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { getCurrencySymbol } from "@angular/common";
import { AppComponent } from "../../../../app.component";
import { StateStatus } from "../../../common/models/state-status";
import { ProcedureSource } from "../../../common/enum/procedure-source";
import { Procedure } from "../../models/procedure";
import { ProcedureAction } from "../../models/procedure-action";
import Create = TechnicalCommercialProposals.Create;
import Update = TechnicalCommercialProposals.Update;
import Publish = TechnicalCommercialProposals.Publish;
import Fetch = TechnicalCommercialProposals.Fetch;
import DownloadTemplate = TechnicalCommercialProposals.DownloadTemplate;
import UploadTemplate = TechnicalCommercialProposals.UploadTemplate;
import PublishByPosition = TechnicalCommercialProposals.PublishByPosition;
import DownloadAnalyticalReport = TechnicalCommercialProposals.DownloadAnalyticalReport;
import FetchAvailablePositions = TechnicalCommercialProposals.FetchAvailablePositions;
import RefreshProcedures = TechnicalCommercialProposals.RefreshProcedures;
import { TechnicalCommercialProposalHelperService } from "../../../common/services/technical-commercial-proposal-helper.service";

@Component({
  templateUrl: './technical-commercial-proposal-list.component.html',
  styleUrls: ['technical-commercial-proposal-list.component.scss'],
  animations: [trigger('sidebarHide', [
    transition(':leave', animate('300ms ease', style({ 'max-width': '0', 'margin-left': '0' }))),
  ])],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @ViewChild('viewPopover') viewPopover: UxgPopoverComponent;
  @Select(TechnicalCommercialProposalState.proposals) proposals$: Observable<TechnicalCommercialProposal[]>;
  @Select(TechnicalCommercialProposalState.proposalsByPositions) proposalsByPositions$: Observable<TechnicalCommercialProposalByPosition[]>;
  @Select(TechnicalCommercialProposalState.availablePositions) availablePositions$: Observable<RequestPosition[]>;
  @Select(TechnicalCommercialProposalState.procedures) procedures$: Observable<Procedure[]>;
  @Select(TechnicalCommercialProposalState.status) status$: Observable<StateStatus>;
  @Select(RequestState.request) request$: Observable<Request>;
  @Select(RequestState.status) requestStatus$: Observable<StateStatus>;
  readonly destroy$ = new Subject();
  requestId: Uuid;
  showForm: boolean;
  files: File[] = [];
  view: "grid" | "list" = "grid";
  addProposalPositionPayload: {
    proposal: TechnicalCommercialProposal,
    position: RequestPosition
  };
  form: FormGroup;
  canNotAddNewContragent = false;
  procedureModalPayload: ProcedureAction & { procedure?: Procedure };
  prolongModalPayload: Procedure;
  proposalModalData: TechnicalCommercialProposalByPosition["data"][number];

  readonly getCurrencySymbol = getCurrencySymbol;
  readonly procedureSource = ProcedureSource.TECHNICAL_COMMERCIAL_PROPOSAL;
  readonly downloadTemplate = (requestId: Uuid) => new DownloadTemplate(requestId);
  readonly uploadTemplate = (requestId: Uuid, files: File[]) => new UploadTemplate(requestId, files);
  readonly downloadAnalyticalReport = (requestId: Uuid) => new DownloadAnalyticalReport(requestId);
  readonly publishPositions = (proposalPositions: TechnicalCommercialProposalByPosition[]) => new PublishByPosition(proposalPositions);
  readonly updateProcedures = () => [new RefreshProcedures(this.requestId), new FetchAvailablePositions(this.requestId)];

  get selectedPositions(): TechnicalCommercialProposalByPosition[] {
    return (this.form.get('positions') as FormArray).controls
      ?.filter(({value}) => value.checked)
      .map(({value}) => (value.item));
  }

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private actions: Actions,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public featureService: FeatureService,
    public store: Store,
    public router: Router,
    public helper: TechnicalCommercialProposalHelperService,
    private app: AppComponent,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      tap(({id}) => this.requestId = id),
      tap(({id}) => this.store.dispatch(new Fetch(id))),
      tap(({id}) => this.store.dispatch(new FetchAvailablePositions(id))),
      switchMap(({id}) => this.store.dispatch(new RequestActions.Fetch(id))),
      switchMap(() => this.request$),
      filter(request => !!request),
      tap(({id, number}) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/backoffice" },
        { label: `Заявка №${number}`, link: `/requests/backoffice/${id}` },
        { label: 'Согласование технико-коммерческих предложений', link: `/requests/backoffice/${this.requestId}/technical-commercial-proposals` }
      ]),
      takeUntil(this.destroy$)
    ).subscribe();

    this.proposalsByPositions$.pipe(filter(p => !!p), takeUntil(this.destroy$)).subscribe((items) => {
      this.form = this.fb.group({
        checked: false,
        positions: this.fb.array(items.map(item => {
          const form = this.fb.group({ checked: false, item });
          if (this.isReviewed(item) || this.isOnReview(item) || item.data.length === 0) {
            form.get("checked").disable();
          }
          return form;
        }))
      });
    });

    this.actions.pipe(
      ofActionCompleted(Create, Update, Publish, UploadTemplate),
      throttleTime(1),
      takeUntil(this.destroy$)
    ).subscribe(({action, result}) => {
      const e = result.error as any;
      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) :
        new ToastActions.Success(`ТКП успешно ${action instanceof Publish ? 'отправлено' : 'сохранено'}`));

      this.allPositionsOnReview();
    });

    this.switchView(this.view);
  }

  ngAfterViewInit() {
    this.gridRows.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this.cd.detectChanges());
  }

  switchView(view: "grid" | "list") {
    this.view = view;
    this.app.noContentPadding = view === "grid";
    this.viewPopover?.hide();
  }

  getContragents(proposals: TechnicalCommercialProposal[]): ContragentShortInfo[] {
    return proposals
      .map(proposal => proposal.supplier);
  }

  getProposalPosition({positions}: TechnicalCommercialProposal, {id}: RequestPosition): TechnicalCommercialProposalPosition {
    return positions.find(({position}) => position.id === id);
  }

  isReviewed({data}: TechnicalCommercialProposalByPosition): boolean {
    return data.some(({proposalPosition: p}) => ['APPROVED', 'REJECTED'].includes(p.status)) && data.length > 0;
  }

  isOnReview({data}: TechnicalCommercialProposalByPosition): boolean {
    return data.every(({proposalPosition: p}) => ['SENT_TO_REVIEW'].includes(p.status)) && data.length > 0;
  }

  withAnalogs({positions}: TechnicalCommercialProposal): boolean {
    return positions.every(({isAnalog}) => isAnalog) && positions.length > 0;
  }

  allPositionsOnReview(): boolean {
    this.proposalsByPositions$.pipe(filter(p => !!p), takeUntil(this.destroy$)).subscribe((items) => {
      this.canNotAddNewContragent = items.every(item => item.data.length > 0 ?
        this.isOnReview(item) || this.isReviewed(item) :
        false
      );
    });

    return this.canNotAddNewContragent;
  }

  addProposalPosition(proposal: TechnicalCommercialProposal, position: RequestPosition) {
    this.addProposalPositionPayload = { proposal, position };
  }

  suppliers(proposals: TechnicalCommercialProposal[]): ContragentShortInfo[] {
    return proposals.reduce((suppliers: ContragentShortInfo[], proposal) => [...suppliers, proposal.supplier], []);
  }

  hasAnalogs(proposals: TechnicalCommercialProposal[]) {
    return i => proposals.map(({ positions }) => positions[i]).some(p => p?.isAnalog);
  }

  trackById = (i, { id }: TechnicalCommercialProposal | Procedure) => id;
  trackByProposalByPositionId = (i, { position }: TechnicalCommercialProposalByPosition) => position.id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
