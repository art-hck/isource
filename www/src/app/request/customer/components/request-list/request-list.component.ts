import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { filter, scan, takeUntil, tap, throttleTime } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestListState } from "../../states/request-list.state";
import { RequestListActions } from "../../actions/request-list.actions";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";
import { RequestsList } from "../../../common/models/requests-list/requests-list";
import { RequestStatus } from "../../../common/enum/request-status";
import { RequestsListFilter } from "../../../common/models/requests-list/requests-list-filter";
import { StateStatus } from "../../../common/models/state-status";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import Fetch = RequestListActions.Fetch;
import AddRequestFromExcel = RequestListActions.AddRequestFromExcel;
import { RequestStatusCount } from "../../../common/models/requests-list/request-status-count";
import { RequestListComponent as CommonRequestListComponent } from "../../../common/components/request-list/request-list.component";
import { RequestsListSort } from "../../../common/models/requests-list/requests-list-sort";
import { AvailableFilters } from "../../models/available-filters";
import FetchAvailableFilters = RequestListActions.FetchAvailableFilters;

@Component({
  templateUrl: './request-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestListComponent implements OnInit, OnDestroy {
  @ViewChild(CommonRequestListComponent) requestListComponent: CommonRequestListComponent;

  @Select(RequestListState.availableFilters) availableFilters$: Observable<AvailableFilters>;
  @Select(RequestListState.requests) requests$: Observable<RequestsList[]>;
  @Select(RequestListState.statusCounters) statusCounters$: Observable<RequestStatusCount>;
  @Select(RequestListState.totalCount) totalCount$: Observable<number>;
  @Select(RequestListState.status) status$: Observable<StateStatus>;

  activeFilters: RequestsListFilter;
  readonly pageSize = this.appConfig.paginator.pageSize;
  readonly fetchFilters$ = new Subject<{ page?: number, filters?: RequestsListFilter , sort?: RequestsListSort }>();
  readonly destroy$ = new Subject();
  readonly addRequestFromExcel = ({ files, requestName }, publish: boolean) => new AddRequestFromExcel(files, requestName, publish);

  constructor(
    @Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface,
    private router: Router,
    private route: ActivatedRoute,
    private actions: Actions,
    public store: Store,
  ) {}

  ngOnInit() {
    this.fetchFilters$.pipe(
      throttleTime(100),
      tap(({ page }) => {
        if (!page) {
          this.router.navigate(["."], { relativeTo: this.route, queryParams: null });
        }
      }),
      scan(({ filters: prev, sort: prevSort}, { page = 1, filters: curr , sort: currSort}) => ({ page, filters: { ...prev, ...curr } , sort: {...prevSort, ...currSort}}), {
        filters: {requestListStatusesFilter: [RequestStatus.IN_PROGRESS]}
      } as { page?: number, filters?: RequestsListFilter, sort?: RequestsListSort } ),
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      this.activeFilters = data.filters;
      this.store.dispatch(new Fetch((data.page - 1) * this.pageSize, this.pageSize, data.filters, data.sort)).subscribe(
        ({ CustomerRequestList }) => {
          this.requestListComponent.switchToPrioritizedTab(CustomerRequestList.requests);
        });
    });

    this.store.dispatch(new FetchAvailableFilters());

    this.actions.pipe(
      ofActionCompleted(AddRequestFromExcel),
      takeUntil(this.destroy$)
    ).subscribe(({ action, result }) => {
      const e = result.error as any;
      const text = (action.publish ? 'Заявка опубликована' : "Черновик заявки создан");

      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) : new ToastActions.Success(text)
      );

      this.store.select(RequestListState.createdRequest).pipe(filter(Boolean)).subscribe((id) => {
        this.router.navigate([id], { relativeTo: this.route });
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}