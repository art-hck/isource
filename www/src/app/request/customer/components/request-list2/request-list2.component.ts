import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { APP_CONFIG } from '@stdlib-ng/core';
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { filter, scan, takeUntil, tap, throttleTime } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
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
import Fetch = RequestListActions.Fetch;
import FetchStatusCounts = RequestListActions.FetchStatusCounts;
import AddRequestFromExcel = RequestListActions.AddRequestFromExcel;

@Component({
  templateUrl: './request-list2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestList2Component implements OnInit, OnDestroy {
  @Select(RequestListState.requests) requests$: Observable<RequestsList[]>;
  @Select(RequestListState.totalCount) totalCount$: Observable<number>;
  @Select(RequestListState.statusCounts) statusCounts$: Observable<RequestStatusCount>;
  @Select(RequestListState.status) status$: Observable<StateStatus>;

  readonly pageSize = this.appConfig.paginator.pageSize;
  readonly fetchFilters$ = new Subject<{page?: number, filters?: RequestsListFilter}>();
  readonly destroy$ = new Subject();
  readonly fetchStatusCounts = () => new FetchStatusCounts();
  readonly addRequestFromExcel = ({files, requestName}, publish: boolean) => new AddRequestFromExcel(files, requestName, publish);

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
      tap(({page}) => {
        if (!page) {
          this.router.navigate(["."], { relativeTo: this.route, queryParams: null });
        }
      }),
      scan(({filters: prev},  {page = 1, filters: curr}) => ({page, filters: {...prev, ...curr}}), {
        filters: {requestListStatusesFilter: [RequestStatus.IN_PROGRESS]}
      } as {page?: number, filters?: RequestsListFilter})
    ).subscribe((data) => {
      this.store.dispatch(new Fetch((data.page - 1) * this.pageSize, this.pageSize, data.filters));
    });

    this.actions.pipe(
      ofActionCompleted(AddRequestFromExcel),
      takeUntil(this.destroy$)
    ).subscribe(({action, result}) => {
      const e = result.error as any;
      const text = (action.publish ? 'Заявка опубликована' : "Черновик заявки создан");

      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) : new ToastActions.Success(text)
      );

      this.store.select(RequestListState.createdRequest).pipe(filter(Boolean)).subscribe((id) => {
        this.router.navigate([id], { relativeTo: this.route});
      });
    });

    this.store.dispatch(new FetchStatusCounts());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
