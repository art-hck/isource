import { DOCUMENT, getCurrencySymbol, isPlatformBrowser } from "@angular/common";
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, InjectionToken, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FeatureService } from "../../../../core/services/feature.service";
import { FormBuilder } from "@angular/forms";
import { map, scan, switchMap, takeUntil, tap, throttleTime } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { RequestsListFilter } from "../../../common/models/requests-list/requests-list-filter";
import { RequestsListSort } from "../../../common/models/requests-list/requests-list-sort";
import { Select, Store } from "@ngxs/store";
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { RequestListState } from "../../states/request-list.state";
import { RequestListActions } from "../../actions/request-list.actions";
import { StateStatus } from "../../../common/models/state-status";
import { RequestStatusCount } from "../../../common/models/requests-list/request-status-count";
import { PositionStatus } from "../../../common/enum/position-status";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { UxgFooterComponent } from "uxg";
import Fetch = RequestListActions.Fetch;

type TabTypes = 'onReviewTab' | 'reviewedTab';
@Component({
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestListComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(UxgFooterComponent, { read: ElementRef }) footerRef: ElementRef;
  @Select(RequestListState.requests) requests$: Observable<RequestsList[]>;
  @Select(RequestListState.statusCounters) statusCounters$: Observable<RequestStatusCount>;
  @Select(RequestListState.tabTotalCount) tabTotalCount$: Observable<number>;
  @Select(RequestListState.totalCount) totalCount$: Observable<number>;
  @Select(RequestListState.status) status$: Observable<StateStatus>;

  readonly pageSize = this.appConfig.paginator.pageSize;
  readonly fetchFilters$ = new Subject<{ page?: number, filters?: RequestsListFilter, sort?: RequestsListSort }>();
  readonly pages$ = this.route.queryParams.pipe(map(params => +params["page"]));
  readonly destroy$ = new Subject();
  readonly form = this.fb.group({
    requestNameOrNumber: '',
    positionStatuses: [[]],
    onlyOpenAgreements: false,
    shipmentDateFrom: '',
    shipmentDateTo: '',
    shipmentDateAsap: false,
    userIds: [[]],
  });
  readonly getCurrencySymbol = getCurrencySymbol;
  constructor(
    @Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface,
    @Inject(DOCUMENT) private document,
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public store: Store,
    public feature: FeatureService,
  ) {}

  ngOnInit() {
    this.fetchFilters$.pipe(
      throttleTime(100),
      tap(({ page }) => {
        if (!page) {
          this.router.navigate(["."], { relativeTo: this.route, queryParams: null });
        }
      }),
      scan(({ filters: prev, sort: prevSort }, { page = 1, filters: curr, sort: currSort }) => ({ page, filters: { ...prev, ...curr }, sort: { ...prevSort, ...currSort } }), {
        filters: {  positionStatuses: [PositionStatus.PROOF_OF_NEED] }
      } as { page?: number, filters?: RequestsListFilter, sort?: RequestsListSort }),
      switchMap(data => this.store.dispatch(new Fetch((data.page - 1) * this.pageSize, this.pageSize, data.filters, data.sort))),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  clickOnTab(isReviewedTab: boolean) {
    this.fetchFilters$.next({ filters:
      isReviewedTab ?  { positionStatuses: [], positionNotStatuses: [PositionStatus.PROOF_OF_NEED] } : { positionStatuses: [PositionStatus.PROOF_OF_NEED], positionNotStatuses: [] }
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const footerEl = this.document.querySelector('.app-footer');
      footerEl?.parentElement.insertBefore(this.footerRef.nativeElement, footerEl);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.footerRef.nativeElement.remove();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }
}
