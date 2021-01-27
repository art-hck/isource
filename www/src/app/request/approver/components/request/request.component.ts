import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { RequestComponent as CommonRequestComponent } from "../../../common/components/request/request.component";
import { Actions, Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { StateStatus } from "../../../common/models/state-status";
import { ActivatedRoute } from "@angular/router";
import { RequestService } from "../../../customer/services/request.service";
import { UxgBreadcrumbsService } from "uxg";
import { Title } from "@angular/platform-browser";
import { filter, switchMap, takeUntil, tap } from "rxjs/operators";
import { RequestActions } from "../../actions/request.actions";
import Refresh = RequestActions.Refresh;
import RefreshPositions = RequestActions.RefreshPositions;
import ApprovePositions = RequestActions.ApprovePositions;
import FetchPositions = RequestActions.FetchPositions;
import Fetch = RequestActions.Fetch;
import RejectPositions = RequestActions.RejectPositions;
import { RequestState } from "../../states/request.state";

@Component({
  templateUrl: './request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestComponent implements OnInit, OnDestroy {
  requestId: Uuid;
  @ViewChild('commonRequestComponent') commonRequestComponent: CommonRequestComponent;
  @Select(RequestState.request) request$: Observable<Request>;
  @Select(RequestState.positions) positions$: Observable<RequestPositionList[]>;
  @Select(RequestState.status) status$: Observable<StateStatus>;
  @Select(RequestState.positionsStatus) positionsStatus$: Observable<StateStatus>;
  readonly destroy$ = new Subject();
  readonly refresh = id => new Refresh(id);
  readonly refreshPositions = id => new RefreshPositions(id);
  readonly approvePositions = positions => new ApprovePositions(this.requestId, positions);
  readonly rejectPositions = data => new RejectPositions(this.requestId, data.positionIds, data.rejectionMessage);

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private bc: UxgBreadcrumbsService,
    private actions: Actions,
    public store: Store,
    private title: Title
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      tap(({id}) => this.requestId = id),
      switchMap(({id}) => this.store.dispatch([new Fetch(id), new FetchPositions(id)])),
      switchMap(() => this.request$),
      filter(request => !!request),
      tap(({id, name}) => this.title.setTitle(name || "Заявка №" + id)),
      tap(({id, number}) => this.bc.breadcrumbs = [
        {label: "Заявки", link: "/requests/approver"},
        {label: `Заявка №${number}`, link: "/requests/approver/" + id}
      ]),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
