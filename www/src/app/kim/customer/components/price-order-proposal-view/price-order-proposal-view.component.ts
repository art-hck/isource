import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UxgBreadcrumbsService, UxgTabTitleComponent } from "uxg";
import { Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { PriceOrderProposalsState } from "../../states/price-order-proposals.state";
import { startWith, switchMap, takeUntil, tap } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { ActivatedRoute } from "@angular/router";
import { PriceOrderProposalsActions } from "../../actions/price-order-proposals.actions";
import { Title } from "@angular/platform-browser";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { AppComponent } from "../../../../app.component";
import { StateStatus } from "../../../../request/common/models/state-status";
import { PriceOrderProposalGridRowComponent } from "../price-order-proposal-grid-row/price-order-proposal-grid-row.component";
import { KimPriceOrderProposal } from "../../../common/models/kim-price-order-proposal";
import { DOCUMENT, getCurrencySymbol } from "@angular/common";
import { KimPriceOrderPosition } from "../../../common/models/kim-price-order-position";
import { KimPriceOrder } from "../../../common/models/kim-price-order";
import Fetch = PriceOrderProposalsActions.Fetch;

@Component({
  templateUrl: './price-order-proposal-view.component.html',
  styleUrls: ['./price-order-proposal-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceOrderProposalViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('proposalOnReview') proposalsOnReview: QueryList<PriceOrderProposalGridRowComponent>;
  @ViewChild('proposalsFooterRef') proposalsFooterRef: ElementRef;
  @ViewChild('reviewedTab') reviewedTab: UxgTabTitleComponent;

  @Select(PriceOrderProposalsState.positionsWithProposals(false))
  positionsOnReview$: Observable<KimPriceOrderPosition[]>;
  @Select(PriceOrderProposalsState.positionsWithProposals(true))
  positionsReviewed$: Observable<KimPriceOrderPosition[]>;
  @Select(PriceOrderProposalsState.proposalsLength) proposalsLength$: Observable<number>;
  @Select(PriceOrderProposalsState.priceOrder) priceOrder$: Observable<KimPriceOrder>;
  @Select(PriceOrderProposalsState.status) status$: Observable<StateStatus>;
  priceOrderId: Uuid;
  view: "grid" | "list" = "grid";
  gridRows: ElementRef[];
  showedProposal: KimPriceOrderProposal;
  readonly destroy$ = new Subject();
  readonly chooseBy$ = new Subject<"date" | "price">();
  readonly getCurrencySymbol = getCurrencySymbol;

  get total() {
    return this.proposalsOnReview?.reduce((total, { selectedProposal }) => {
      const proposalPosition: KimPriceOrderProposal = selectedProposal.value;
      total += proposalPosition?.priceWithoutVat * proposalPosition?.quantity || 0;
      return total;
    }, 0);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private store: Store,
    private title: Title,
    private bc: UxgBreadcrumbsService,
    private cd: ChangeDetectorRef,
    private app: AppComponent
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      tap(({id}) => this.priceOrderId = id),
      switchMap(({id}) => this.store.dispatch(new Fetch(id))),
      switchMap(() => this.priceOrder$),
      tap(({id, name}) => this.title.setTitle(name)),
      tap(({id, name}) => this.bc.breadcrumbs = [
        { label: 'Мои ценовые запросы', link: `/kim/customer/price-orders` },
        { label: name, link: `/kim/customer/price-orders/${id}` }
      ]),
      takeUntil(this.destroy$),
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

  hasAnalogs(positions: KimPriceOrderPosition[]) {
    return i => positions.map(({ proposals }) => proposals[i]).some(p => p?.isAnalog);
  }

  suppliers(positions: KimPriceOrderPosition[]) {
    return positions.reduce((suppliers: ContragentShortInfo[], { proposals }) => {
      proposals
        .filter(({ proposalSupplier }) => suppliers.findIndex(({ id }) => proposalSupplier.supplier.id === id) < 0)
        .forEach(({ proposalSupplier }) => suppliers.push(proposalSupplier.supplier));

      return suppliers;
    }, []);
  }

  rejectAll(positions: KimPriceOrderPosition[]) {
    // @TODO: ждём бэк на выбор победителя
    positions.map(({ id }) => id);
  }

  reviewSelected() {
    // @TODO: ждём бэк на выбор победителя
    console.log("selected", this.proposalsOnReview
      .filter(({selectedProposal: c}) => c.valid)
      .map(({ selectedProposal: c }) => c.value));
    console.log("rejected", this.proposalsOnReview
      .filter(({rejectedProposalPosition: c}) => c.valid)
      .map(({ rejectedProposalPosition: c }) => c.value));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.proposalsFooterRef.nativeElement.remove();
  }
}
