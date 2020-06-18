import { ActivatedRoute } from "@angular/router";
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { filter, switchMap, takeUntil, tap } from "rxjs/operators";
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
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { RequestPosition } from "../../../common/models/request-position";
import { AppComponent } from "../../../../app.component";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { GridFooterComponent } from "../../../../shared/components/grid/grid-footer/grid-footer.component";
import { TechnicalCommercialProposalPositionStatus } from "../../../common/enum/technical-commercial-proposal-position-status";
import Approve = TechnicalCommercialProposals.Approve;
import Reject = TechnicalCommercialProposals.Reject;
import Fetch = TechnicalCommercialProposals.Fetch;
import ApproveMultiple = TechnicalCommercialProposals.ApproveMultiple;
import NEW = TechnicalCommercialProposalPositionStatus.NEW;
import APPROVED = TechnicalCommercialProposalPositionStatus.APPROVED;
import REJECTED = TechnicalCommercialProposalPositionStatus.REJECTED;
import SENT_TO_EDIT = TechnicalCommercialProposalPositionStatus.SENT_TO_EDIT;
import SENT_TO_REVIEW = TechnicalCommercialProposalPositionStatus.SENT_TO_REVIEW;
import SendToEditMultiple = TechnicalCommercialProposals.SendToEditMultiple;

@Component({
  templateUrl: './technical-commercial-proposal-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PluralizePipe]
})
export class TechnicalCommercialProposalListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('proposalOnReview') proposalsOnReview: QueryList<TechnicalCommercialProposalComponent>;
  @ViewChild('sentToReviewTab') sentToReviewTab: UxgTabTitleComponent;
  @ViewChild(GridFooterComponent, { read: ElementRef }) proposalsFooterRef: ElementRef;
  @Select(RequestState.request)
  readonly request$: Observable<Request>;
  @Select(TechnicalCommercialProposalState.proposalsByPos([NEW, SENT_TO_REVIEW]))
  readonly proposalsSentToReview$: Observable<TechnicalCommercialProposalByPosition[]>;
  @Select(TechnicalCommercialProposalState.proposalsByPos([APPROVED, REJECTED]))
  readonly proposalsReviewed$: Observable<TechnicalCommercialProposalByPosition[]>;
  @Select(TechnicalCommercialProposalState.proposalsByPos([SENT_TO_EDIT]))
  readonly proposalsSendToEdit$: Observable<TechnicalCommercialProposalByPosition[]>;
  @Select(TechnicalCommercialProposalState.proposals)
  readonly proposals$: Observable<TechnicalCommercialProposal[]>;
  @Select(TechnicalCommercialProposalState.status)
  readonly stateStatus$: Observable<StateStatus>;
  readonly chooseBy$ = new Subject<"date" | "price">();
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly destroy$ = new Subject();
  requestId: Uuid;
  gridRows: ElementRef[];
  view: "grid" | "list" = "grid";

  get total() {
    return this.proposalsOnReview?.reduce((total, curr) => {
      const proposalPosition: TechnicalCommercialProposalPosition = curr.selectedProposal.value;
      total += proposalPosition?.priceWithoutVat * proposalPosition?.quantity || 0;
      return total;
    }, 0);
  }

  get disabled() {
    return this.proposalsOnReview
      .toArray().every(({selectedProposal, sendToEditPosition}) => selectedProposal.invalid && sendToEditPosition.invalid);
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
      ofActionCompleted(Approve, Reject, ApproveMultiple),
      takeUntil(this.destroy$)
    ).subscribe(({result, action}) => {
      const e = result.error as any;
      const length = action?.proposalPositions.length ?? 1;
      const text = (action instanceof Reject ? "$1 отклонено" : "По $0 выбран победитель")
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
    const footerEl = this.document.querySelector('.app-footer');
    footerEl.parentElement.insertBefore(this.proposalsFooterRef.nativeElement, footerEl);

    this.proposalsOnReview.changes.pipe(
      tap(() => this.gridRows = this.proposalsOnReview.reduce((gridRows, c) => [...gridRows, ...c.gridRows], [])),
      tap(() => this.cd.detectChanges()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  approveMultiple() {
    if (this.proposalsOnReview.filter(({selectedProposal}) => selectedProposal.valid).length) {
      this.store.dispatch(new ApproveMultiple(
        this.proposalsOnReview
          .filter(({ selectedProposal }) => selectedProposal.valid)
          .map(({ selectedProposal }) => selectedProposal.value)
      ));
    }

    if (this.proposalsOnReview.filter(({sendToEditPosition}) => sendToEditPosition.valid).length) {
      this.store.dispatch(new SendToEditMultiple(
        this.proposalsOnReview
          .filter(({ sendToEditPosition }) => sendToEditPosition.valid)
          .map(({ sendToEditPosition }) => sendToEditPosition.value)
      ));
    }
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

  suppliers(proposals: TechnicalCommercialProposal[]): ContragentShortInfo[] {
    return proposals.reduce((suppliers: ContragentShortInfo[], proposal) => [...suppliers, proposal.supplier], []);
  }

  hasAnalogs(proposals: TechnicalCommercialProposal[]) {
    return i => proposals.map(({ positions }) => positions[i]).some(p => p?.isAnalog);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.proposalsFooterRef.nativeElement.remove();
  }
}
