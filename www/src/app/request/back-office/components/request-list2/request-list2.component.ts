import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { APP_CONFIG } from '@stdlib-ng/core';
import { Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { scan, tap, throttleTime } from "rxjs/operators";
import { Router } from "@angular/router";
import { RequestListState } from "../../states/request-list.state";
import { RequestListActions } from "../../actions/request-list.actions";
import { GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { RequestStatus } from "../../../common/enum/request-status";
import { RequestsListFilter } from "../../../common/models/requests-list/requests-list-filter";
import { RequestStatusCount } from "../../../common/models/requests-list/request-status-count";
import { StateStatus } from "../../../common/models/state-status";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { Toast } from "../../../../shared/models/toast";
import { AvailableFilters } from "../../models/available-filters";
import Fetch = RequestListActions.Fetch;
import FetchStatusCounts = RequestListActions.FetchStatusCounts;
import FetchAvailableFilters = RequestListActions.FetchAvailableFilters;

@Component({
  templateUrl: './request-list2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestList2Component implements OnInit, OnDestroy {
  @Select(RequestListState.availableFilters) availableFilters$: Observable<AvailableFilters>;
  @Select(RequestListState.requests) requests$: Observable<RequestsList[]>;
  @Select(RequestListState.totalCount) totalCount$: Observable<number>;
  @Select(RequestListState.statusCounts) statusCounts$: Observable<RequestStatusCount>;
  @Select(RequestListState.status) status$: Observable<StateStatus>;

  readonly pageSize = this.appConfig.paginator.pageSize;
  readonly fetchFilters$ = new Subject<{page?: number, filters?: RequestsListFilter}>();
  readonly destroy$ = new Subject();
  readonly fetchStatusCounts = () => new FetchStatusCounts();

  constructor(
    @Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface,
    private store: Store,
    private router: Router,
    public store: Store,
  ) {}

  ngOnInit() {
    this.fetchFilters$.pipe(
      throttleTime(100),
      tap(({page}) => {
        if (!page) {
          this.router.navigate(["."], { queryParams: null });
        }
      }),
      scan(({filters: prev},  {page = 1, filters: curr}) => ({page, filters: {...prev, ...curr}}), {
        filters: {requestListStatusesFilter: [RequestStatus.IN_PROGRESS]}
      } as {page?: number, filters?: RequestsListFilter})
    ).subscribe((data) => {
      this.store.dispatch(new Fetch((data.page - 1) * this.pageSize, this.pageSize, data.filters));
    });

    this.store.dispatch(new FetchAvailableFilters());
    this.store.dispatch(new FetchStatusCounts());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
