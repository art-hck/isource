import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { scan, switchMap, takeUntil, tap, throttleTime } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestListState } from "../../states/request-list.state";
import { RequestListActions } from "../../actions/request-list.actions";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { RequestStatus } from "../../../common/enum/request-status";
import { RequestsListFilter } from "../../../common/models/requests-list/requests-list-filter";
import { RequestStatusCount } from "../../../common/models/requests-list/request-status-count";
import { StateStatus } from "../../../common/models/state-status";
import { AvailableFilters } from "../../models/available-filters";
import { RequestListComponent as CommonRequestListComponent } from "../../../common/components/request-list/request-list.component";
import { RequestsListSort } from "../../../common/models/requests-list/requests-list-sort";
import { FormBuilder } from "@angular/forms";
import { saveAs } from 'file-saver/src/FileSaver';
import Fetch = RequestListActions.Fetch;
import FetchAvailableFilters = RequestListActions.FetchAvailableFilters;
import { RequestService } from "../../services/request.service";

@Component({
  templateUrl: './request-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestListComponent implements OnInit, OnDestroy {
  @ViewChild(CommonRequestListComponent) requestListComponent: CommonRequestListComponent;

  @Select(RequestListState.availableFilters) availableFilters$: Observable<AvailableFilters>;
  @Select(RequestListState.requests) requests$: Observable<RequestsList[]>;
  @Select(RequestListState.statusCounters) statusCounters$: Observable<RequestStatusCount>;
  @Select(RequestListState.tabTotalCount) tabTotalCount$: Observable<number>;
  @Select(RequestListState.totalCount) totalCount$: Observable<number>;
  @Select(RequestListState.status) status$: Observable<StateStatus>;

  readonly pageSize = this.appConfig.paginator.pageSize;
  readonly fetchFilters$ = new Subject<{page?: number, filters?: RequestsListFilter, sort?: RequestsListSort}>();
  readonly destroy$ = new Subject();
  readonly form = this.fb.group({
    requestNameOrNumber: '',
    positionStatuses: [[]],
    onlyOpenTasks: false,
    customers: [[]]
  });

  constructor(
    @Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public store: Store,
    public requestService: RequestService
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
    ).subscribe(({ BackofficeRequestList }) => {
      this.requestListComponent.switchToPrioritizedTab(BackofficeRequestList.requests);
    });

    this.store.dispatch(new FetchAvailableFilters());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  downloadRequests() {
    this.requestService.downloadRequests()
      .subscribe(data => saveAs(data, `Registry.xlsx`));
  }

}
