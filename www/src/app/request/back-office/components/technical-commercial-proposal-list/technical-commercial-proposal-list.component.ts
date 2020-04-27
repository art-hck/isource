import { ActivatedRoute, Router } from "@angular/router";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import Create = TechnicalCommercialProposals.Create;
import Update = TechnicalCommercialProposals.Update;
import Publish = TechnicalCommercialProposals.Publish;
import Fetch = TechnicalCommercialProposals.Fetch;
import DownloadTemplate = TechnicalCommercialProposals.DownloadTemplate;
import UploadTemplate = TechnicalCommercialProposals.UploadTemplate;
import PublishByPosition = TechnicalCommercialProposals.PublishByPosition;
import DownloadAnalyticalReport = TechnicalCommercialProposals.DownloadAnalyticalReport;
import FetchAvailablePositions = TechnicalCommercialProposals.FetchAvailablePositions;

@Component({
  templateUrl: './technical-commercial-proposal-list.component.html',
  styleUrls: ['technical-commercial-proposal-list.component.scss'],
  animations: [trigger('sidebarHide', [
    transition(':leave', animate('300ms ease', style({ 'max-width': '0', 'margin-left': '0' }))),
  ])],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalListComponent implements OnInit, OnDestroy {
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @ViewChild('viewPopover') viewPopover: UxgPopoverComponent;
  @Select(TechnicalCommercialProposalState.proposals) proposals$: Observable<TechnicalCommercialProposal[]>;
  @Select(TechnicalCommercialProposalState.proposalsByPositions) proposalsByPositions$: Observable<TechnicalCommercialProposalByPosition[]>;
  @Select(TechnicalCommercialProposalState.availablePositions) availablePositions$: Observable<RequestPosition[]>;
  @Select(TechnicalCommercialProposalState.status) status$: Observable<StateStatus>;
  @Select(RequestState.request) request$: Observable<Request>;
  readonly destroy$ = new Subject();
  requestId: Uuid;
  showForm: boolean;
  files: File[] = [];
  view: "grid" | "list" = "grid";
  addProposalPositionData: {
    proposal: TechnicalCommercialProposal,
    position: RequestPosition
  };
  form: FormGroup;
  canNotAddNewContragent = false;
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly downloadTemplate = (requestId: Uuid) => new DownloadTemplate(requestId);
  readonly uploadTemplate = (requestId: Uuid, files: File[]) => new UploadTemplate(requestId, files);
  readonly downloadAnalyticalReport = (requestId: Uuid) => new DownloadAnalyticalReport(requestId);
  readonly publishPositions = (proposalPositions: TechnicalCommercialProposalByPosition[]) => new PublishByPosition(proposalPositions);

  get selectedPositions(): TechnicalCommercialProposalByPosition[] {
    return (this.form.get('positions') as FormArray).controls
      ?.filter(({value}) => value.checked)
      .map(({value}) => (value.item));
  }

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private featureService: FeatureService,
    private actions: Actions,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public store: Store,
    public router: Router,
    private app: AppComponent
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
    return data.some(({proposal: p}) => p.status === 'REVIEWED') && data.length > 0;
  }

  isOnReview({data}: TechnicalCommercialProposalByPosition): boolean {
    return data.every(({proposalPosition: p}) => p.status === 'SENT_TO_REVIEW') && data.length > 0;
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
    this.addProposalPositionData = {proposal, position};
  }

  trackByProposalId = (i, proposal: TechnicalCommercialProposal) => proposal.id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
