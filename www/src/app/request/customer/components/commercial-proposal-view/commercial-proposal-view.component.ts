import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UxgBreadcrumbsService, UxgTabTitleComponent } from "uxg";
import { Uuid } from "../../../../cart/models/uuid";
import { Actions, Select, Store } from "@ngxs/store";
import { RequestState } from "../../states/request.state";
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { StateStatus } from "../../../common/models/state-status";
import { DOCUMENT, getCurrencySymbol } from "@angular/common";
import { AppComponent } from "../../../../app.component";
import { filter, startWith, switchMap, takeUntil, tap } from "rxjs/operators";
import { RequestActions } from "../../actions/request.actions";
import { CommercialProposals } from "../../actions/commercial-proposal.actions";
import { CommercialProposalState } from "../../states/commercial-proposal.state";
import { PositionStatus } from "../../../common/enum/position-status";
import { RequestPosition } from "../../../common/models/request-position";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { GridFooterComponent } from "../../../../shared/components/grid/grid-footer/grid-footer.component";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { Proposal } from "../../../../shared/components/grid/proposal";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import { GridRowComponent } from "../../../../shared/components/grid/grid-row/grid-row.component";
import { Position } from "../../../../shared/components/grid/position";
import Fetch = CommercialProposals.Fetch;
import Approve = CommercialProposals.Approve;
import { CommercialProposalListComponent } from "../commercial-proposal-list/commercial-proposal-list.component";

@Component({
  templateUrl: './commercial-proposal-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommercialProposalViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('proposalOnReview') proposalsOnReview: QueryList<GridRowComponent | CommercialProposalListComponent>;
  @ViewChild(GridFooterComponent, { read: ElementRef }) proposalsFooterRef: ElementRef;
  @ViewChild('reviewedTab') reviewedTab: UxgTabTitleComponent;

  @Select(CommercialProposalState.proposalsByPos(PositionStatus.RESULTS_AGREEMENT))
  readonly positionsOnReview$: Observable<RequestPosition[]>;
  @Select(CommercialProposalState.proposalsByPos(PositionStatus.WINNER_SELECTED))
  readonly positionsReviewed$: Observable<RequestPosition[]>;
  @Select(CommercialProposalState.positionsLength) readonly positionsLength$: Observable<number>;
  @Select(RequestState.request) readonly request$: Observable<Request>;
  @Select(CommercialProposalState.status) readonly status$: Observable<StateStatus>;
  @Select(CommercialProposalState.suppliers) readonly suppliers$: Observable<ContragentList[]>;
  requestId: Uuid;
  view: "grid" | "list" = "grid";
  gridRows: ElementRef[];
  showedProposal: Proposal<RequestOfferPosition>;
  modalData: { proposal: Proposal<RequestOfferPosition>, position: Position<RequestPosition> };
  readonly destroy$ = new Subject();
  readonly chooseBy$ = new Subject<"date" | "price">();
  readonly getCurrencySymbol = getCurrencySymbol;

  get total() {
    return this.proposalsOnReview?.reduce((total, { selectedProposal }) => {
      const proposalPosition: Proposal = selectedProposal.value;
      total += proposalPosition?.priceWithoutVat * proposalPosition?.quantity || 0;
      return total;
    }, 0);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private store: Store,
    private actions: Actions,
    private bc: UxgBreadcrumbsService,
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
        { label: 'Согласование коммерческих предложений', link: `/requests/customer/${id}/commercial-proposals` }
      ]),
      takeUntil(this.destroy$)
    ).subscribe();

    this.switchView(this.view);
  }

  ngAfterViewInit() {
    const footerEl = this.document.querySelector('.app-footer');
    footerEl.parentElement.insertBefore(this.proposalsFooterRef.nativeElement, footerEl);

    this.proposalsOnReview.changes.pipe(
      startWith(this.proposalsOnReview),
      tap(() => this.gridRows = this.proposalsOnReview.reduce((gridRows, c) => [...gridRows, ...c.gridRows], [])),
      tap(() => this.cd.detectChanges()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  switchView(view: "grid" | "list") {
    this.view = view;
    this.app.noContentPadding = view === "grid";
    this.cd.detectChanges();
  }

  hasAnalogs(positions: RequestPosition[]) {
    return i => positions.map(({ linkedOffers }) => linkedOffers[i]).some(p => p?.isAnalog);
  }

  rejectAll(positions: RequestPosition[]) {
    // @TODO: ждём бэк на отклонение позиций
    positions.map(({ id }) => id);
  }

  reviewSelected() {
    this.store.dispatch(new Approve(
      this.requestId,
      this.proposalsOnReview
        .filter(({selectedProposal: c}) => c.valid)
        .reduce((result, {selectedProposal: c, position}) => ({ ...result, [position.id]: c.value.id }), {})
    ));
  }

  convertProposals(proposals: RequestOfferPosition[]) {
    return proposals.map(p => new Proposal(p));
  }

  convertPosition(position: RequestPosition) {
    return new Position(position);
  }

  getProposalBySupplier = (position: RequestPosition) => ({ id }: ContragentShortInfo) => {
    const proposal = position.linkedOffers.find(({ supplierContragentId }) => supplierContragentId === id);
    return proposal ? new Proposal<RequestOfferPosition>(proposal) : null;
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.proposalsFooterRef.nativeElement.remove();
  }
}
