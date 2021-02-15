import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { RequestComponent as CommonRequestComponent } from "../../../common/components/request/request.component";
import { Actions, Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { StateStatus } from "../../../common/models/state-status";
import { ActivatedRoute, Router } from "@angular/router";
import { PositionService } from "../../../customer/services/position.service";
import { UxgBreadcrumbsService } from "uxg";
import { Title } from "@angular/platform-browser";
import { filter, switchMap, takeUntil, tap } from "rxjs/operators";
import { RequestActions } from "../../actions/request.actions";
import { RequestState } from "../../states/request.state";
import { PositionStatus } from "../../../common/enum/position-status";
import { PositionFilter } from "../../../common/models/position-filter";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import Refresh = RequestActions.Refresh;
import RefreshPositions = RequestActions.RefreshPositions;
import FetchPositions = RequestActions.FetchPositions;
import Fetch = RequestActions.Fetch;

@Component({
  templateUrl: './request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestComponent implements OnInit, OnDestroy {
  requestId: Uuid;
  positionFilter: PositionFilter;
  @ViewChild('commonRequestComponent') commonRequestComponent: CommonRequestComponent;
  @Select(RequestState.request) request$: Observable<Request>;
  @Select(RequestState.positions) positions$: Observable<RequestPositionList[]>;
  @Select(RequestState.status) status$: Observable<StateStatus>;
  @Select(RequestState.positionsStatus) positionsStatus$: Observable<StateStatus>;
  readonly destroy$ = new Subject();
  readonly refresh = id => new Refresh(id);
  readonly refreshPositions = id => new RefreshPositions(id);

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private positionService: PositionService,
    private bc: UxgBreadcrumbsService,
    private actions: Actions,
    public store: Store,
    private title: Title,
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      tap(({id}) => this.requestId = id),
      switchMap(({id}) => {
        if (!this.route.snapshot.queryParams.showOnlyApproved) {
          this.request$.pipe(filter(request => !!request)).subscribe(request => {
            const onlyApproved = request.status === 'ON_CUSTOMER_APPROVAL' ? '0' : '1';

            this.positionFilter = onlyApproved === '0' ?
              { "statuses": [PositionStatus.PROOF_OF_NEED]} :
              { "notStatuses": [PositionStatus.PROOF_OF_NEED]};

            this.router.navigateByUrl(this.router.url + '?showOnlyApproved=' + onlyApproved);
          });
        } else {
          this.positionFilter = this.route.snapshot.queryParams.showOnlyApproved === '1' ?
            { "notStatuses": [PositionStatus.PROOF_OF_NEED]} : { "statuses": [PositionStatus.PROOF_OF_NEED]};
        }

        return this.store.dispatch([new Fetch(id), new FetchPositions(id, this.positionFilter)]);
      }),
      switchMap(() => this.request$),
      filter(request => !!request),
      tap(({id, name}) => this.title.setTitle(name || "Заявка №" + id)),
      tap(({id, number}) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/approver" },
        { label: `Заявка №${number}`, link: "/requests/approver/" + id, queryParams: {
          showOnlyApproved: this.route.snapshot.queryParams.showOnlyApproved
        }}
      ]),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  rejectPositions(positionIds: Uuid[]) {
    this.positionService.changePositionsStatus(positionIds, PositionStatus.CANCELED).subscribe(
      () => this.store.dispatch(
        [new ToastActions.Success(positionIds.length > 1 ? positionIds.length + ' позиции отклонены' : 'Позиция отклонена'),
        new RefreshPositions(this.requestId, this.positionFilter)]));
  }

  approvePositions(positionIds: Uuid[]) {
    this.positionService.changePositionsStatus(positionIds, PositionStatus.NEW).subscribe(
      () => this.store.dispatch(
        [new ToastActions.Success(positionIds.length > 1 ? positionIds.length + ' позиции успешно согласованы' :
          'Позиция успешно согласована'),
        new RefreshPositions(this.requestId, this.positionFilter)]));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
