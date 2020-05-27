import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UxgBreadcrumbsService } from "uxg";
import { Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { PriceOrderProposalsState } from "../../states/price-order-proposals.state";
import { KimPriceOrderPositionWithProposals, KimPriceOrderProposals } from "../../../common/models/kim-price-order-proposals";
import { startWith, switchMap, takeUntil, tap } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { ActivatedRoute } from "@angular/router";
import { PriceOrderProposalsActions } from "../../actions/price-order-proposals.actions";
import { Title } from "@angular/platform-browser";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { AppComponent } from "../../../../app.component";
import { StateStatus } from "../../../../request/common/models/state-status";
import { PriceOrderProposalGridRowComponent } from "../price-order-proposal-grid-row/price-order-proposal-grid-row.component";
import Fetch = PriceOrderProposalsActions.Fetch;

@Component({
  templateUrl: './price-order-proposal-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceOrderProposalViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('proposalOnReview') proposalsOnReview: QueryList<PriceOrderProposalGridRowComponent>;

  @Select(PriceOrderProposalsState.positionsWithProposals(false))
  positionsWithProposalsOnReview$: Observable<KimPriceOrderPositionWithProposals[]>;
  @Select(PriceOrderProposalsState.positionsWithProposals(true))
  positionsWithProposalsReviewed$: Observable<KimPriceOrderPositionWithProposals[]>;
  @Select(PriceOrderProposalsState.proposalsLength) proposalsLength$: Observable<number>;
  @Select(PriceOrderProposalsState.priceOrder) priceOrder$: Observable<KimPriceOrderProposals>;
  @Select(PriceOrderProposalsState.status) status$: Observable<StateStatus>;
  priceOrderId: Uuid;
  view: "grid" | "list" = "grid";
  gridRows: ElementRef[];
  readonly destroy$ = new Subject();
  readonly chooseBy$ = new Subject<"date" | "price">();

  constructor(
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
    // const footerEl = this.document.querySelector('.app-footer');
    // footerEl.parentElement.insertBefore(this.proposalsFooterRef.nativeElement, footerEl);

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

  hasAnalogs(positionsWithProposals: KimPriceOrderPositionWithProposals[]) {
    return i => positionsWithProposals.map(({ proposalPositions }) => proposalPositions[i]).some(p => p?.isAnalog);
  }

  suppliers(positionsWithProposals: KimPriceOrderPositionWithProposals[]) {
    return positionsWithProposals.reduce((suppliers: ContragentShortInfo[], { proposalPositions }) => {
      proposalPositions
        .filter(({ supplier }) => suppliers.findIndex(({ id }) => supplier.id === id) < 0)
        .forEach(({ supplier }) => suppliers.push(supplier));

      return suppliers;
    }, []);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
