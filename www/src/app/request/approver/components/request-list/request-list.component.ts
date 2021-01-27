import { getCurrencySymbol } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
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
import { RequestStatus } from "../../../common/enum/request-status";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import Fetch = RequestListActions.Fetch;

type TabTypes = 'onReviewTab' | 'reviewedTab';
@Component({
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestListComponent {
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
  readonly tabsStatuses: Record<TabTypes, RequestStatus[]> = {
    'onReviewTab': [RequestStatus.IN_PROGRESS],
    'reviewedTab': [RequestStatus.COMPLETED, RequestStatus.DRAFT, RequestStatus.ON_CUSTOMER_APPROVAL, RequestStatus.NEW, RequestStatus.NOT_RELEVANT],
  }
  readonly getCurrencySymbol = getCurrencySymbol;
  constructor(
    @Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface,
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
        filters: { requestListStatusesFilter: [] }
      } as { page?: number, filters?: RequestsListFilter, sort?: RequestsListSort }),
      switchMap(data => this.store.dispatch(new Fetch((data.page - 1) * this.pageSize, this.pageSize, data.filters, data.sort))),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  clickOnTab(tab: TabTypes) {
    this.fetchFilters$.next({ filters: { requestListStatusesFilter: this.tabsStatuses[tab] } });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
