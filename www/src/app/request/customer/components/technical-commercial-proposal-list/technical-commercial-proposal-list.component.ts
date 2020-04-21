import { ActivatedRoute } from "@angular/router";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { bufferTime, filter, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService, UxgTabTitleComponent } from "uxg";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { StateStatus } from "../../../common/models/state-status";
import { TechnicalCommercialProposalByPosition } from "../../../common/models/technical-commercial-proposal-by-position";
import { TechnicalCommercialProposalComponent } from "../technical-commercial-proposal/technical-commercial-proposal.component";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { DOCUMENT, getCurrencySymbol } from "@angular/common";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { PluralizePipe } from "../../../../shared/pipes/pluralize-pipe";
import { TechnicalCommercialProposalStatus } from "../../../common/enum/technical-commercial-proposal-status";
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { RequestPosition } from "../../../common/models/request-position";
import { AppComponent } from "../../../../app.component";
import { ProposalGridCardComponent } from "../../../common/components/technical-commercial-proposal/proposal-grid-card/proposal-grid-card.component";
import Approve = TechnicalCommercialProposals.Approve;
import Reject = TechnicalCommercialProposals.Reject;
import Fetch = TechnicalCommercialProposals.Fetch;
import ApproveMultiple = TechnicalCommercialProposals.ApproveMultiple;

@Component({
  templateUrl: './technical-commercial-proposal-list.component.html',
  styleUrls: ['technical-commercial-proposal-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PluralizePipe]
})
export class TechnicalCommercialProposalListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('proposalOnReview') proposalsOnReview: QueryList<TechnicalCommercialProposalComponent>;
  @ViewChild('reviewedTab') set content(tab: UxgTabTitleComponent) {
    this.isProposalsFooterHidden = tab?.active;
    this.cd.detectChanges();
  }
  @ViewChild('proposalsFooterRef') proposalsFooterRef: ElementRef;
  @Select(RequestState.request)
  readonly request$: Observable<Request>;
  @Select(TechnicalCommercialProposalState.proposalsByPos(TechnicalCommercialProposalStatus.SENT_TO_REVIEW))
  readonly proposalsSentToReview$: Observable<TechnicalCommercialProposalByPosition[]>;
  @Select(TechnicalCommercialProposalState.proposalsByPos(TechnicalCommercialProposalStatus.REVIEWED))
  readonly proposalsReviewed$: Observable<TechnicalCommercialProposalByPosition[]>;
  @Select(TechnicalCommercialProposalState.proposals)
  readonly proposals$: Observable<TechnicalCommercialProposal[]>;
  @Select(TechnicalCommercialProposalState.status)
  readonly stateStatus$: Observable<StateStatus>;
  readonly chooseBy$ = new Subject<"date" | "price">();
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly destroy$ = new Subject();
  requestId: Uuid;
  isProposalsFooterHidden: boolean;
  gridRows: ElementRef[];
  view: "grid" | "list" = "grid";

  get total() {
    return this.proposalsOnReview?.reduce((total, curr) => {
      const proposalPosition: TechnicalCommercialProposalPosition = curr.selectedProposalPosition.value;
      total += proposalPosition?.priceWithoutVat * proposalPosition?.quantity || 0;
      return total;
    }, 0);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private store: Store,
    private actions: Actions,
    private pluralize: PluralizePipe,
    private cd: ChangeDetectorRef,
    private app: AppComponent
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(({id}) => this.requestId = id),
      tap(({id}) => this.store.dispatch(new Fetch(id))),
      switchMap(({id}) => this.store.dispatch(new RequestActions.Fetch(id))),
      switchMap(() => this.request$),
      filter(request => !!request),
      tap(({id, number}) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/customer" },
        { label: `Заявка №${number}`, link: `/requests/customer/${id}` },
        { label: 'Согласование технико-коммерческих предложений', link: `/requests/customer/${id}/technical-commercial-proposals` }
      ]),
      takeUntil(this.destroy$)
    ).subscribe();

    this.actions.pipe(
      ofActionCompleted(Approve, Reject),
      bufferTime(2000),
      filter(data => data.length > 0),
      map(data => ({...data[0], length: data.length}))
    ).subscribe(({result, action, length}) => {
      const e = result.error as any;
      const text = (action instanceof Approve ? 'По $0 выбран победитель' : "$1 отклонено")
        .replace(/\$(\d)/g, (all, i) => [
          this.pluralize.transform(length, "позиции", "позициям", "позициям"),
          this.pluralize.transform(length, "предложение", "предложения", "предложений"),
        ][i] || all);

      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) : new ToastActions.Success(text)
      );
    });



    this.switchView(this.view);
  }

  ngAfterViewInit() {
    this.document.querySelector('.app-scroll').insertBefore(
      this.proposalsFooterRef.nativeElement,
      this.document.querySelector('.app-footer')
    );

    this.proposalsOnReview.changes.pipe(
      tap(() => this.gridRows = this.proposalsOnReview.reduce((gridRows, c) => [...gridRows, ...c.gridRows], [])),
      tap(() => this.cd.detectChanges()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  approveMultiple() {
    this.store.dispatch(new ApproveMultiple(
      this.proposalsOnReview
        .filter(({selectedProposalPosition}) => selectedProposalPosition.valid)
        .map(({selectedProposalPosition}) => selectedProposalPosition.value)
    ));
  }

  rejectAll() {
    this.proposalsOnReview.forEach(component => component.reject());
  }

  getProposalPosition({positions}: TechnicalCommercialProposal, {id}: RequestPosition): TechnicalCommercialProposalPosition {
    return positions.find(({position}) => position.id === id);
  }

  trackByPositionId(i, item: TechnicalCommercialProposalByPosition) {
    return item.position.id;
  }

  switchView(view: "grid" | "list") {
    this.view = view;
    this.app.noContentPadding = view === "grid";
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.proposalsFooterRef.nativeElement.remove();
  }
}
