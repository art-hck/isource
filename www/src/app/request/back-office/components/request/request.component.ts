import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { RequestService } from "../../services/request.service";
import { ActivatedRoute } from "@angular/router";
import { switchMap, takeUntil, tap } from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import { UxgBreadcrumbsService } from "uxg";
import { Select, Store } from "@ngxs/store";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestPosition } from "../../../common/models/request-position";
import { RequestActions } from "../../actions/request.actions";
import { RequestState } from "../../states/request.state";
import { StateStatus } from "../../../common/models/state-status";
import UploadFromTemplate = RequestActions.UploadFromTemplate;
import Publish = RequestActions.Publish;
import RefreshPositions = RequestActions.RefreshPositions;
import Refresh = RequestActions.Refresh;
import Fetch = RequestActions.Fetch;
import FetchPositions = RequestActions.FetchPositions;

@Component({
  templateUrl: './request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestComponent implements OnInit, OnDestroy {
  requestId: Uuid;
  @Select(RequestState.request) request$: Observable<Request>;
  @Select(RequestState.positions) positions$: Observable<RequestPositionList[]>;
  @Select(RequestState.status) status$: Observable<StateStatus>;
  @Select(RequestState.positionsStatus) positionsStatus$: Observable<StateStatus>;
  readonly destroy$ = new Subject();
  readonly refresh = id => new Refresh(id);
  readonly refreshPositions = id => new RefreshPositions(id);
  readonly publish = id => new Publish(id);
  readonly uploadFromTemplate = ({files}) => new UploadFromTemplate(this.requestId, files);
  readonly sendOnApprove = (position: RequestPosition): Observable<RequestPosition> => this.store
    .dispatch(new Publish(this.requestId, false)).pipe(
      switchMap(() => this.requestService.getRequestPosition(this.requestId, position.id))
    )

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private bc: UxgBreadcrumbsService,
    private store: Store,
    private title: Title
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(({id}) => this.requestId = id),
      switchMap(({id}) => this.store.dispatch([new Fetch(id), new FetchPositions(id)])),
      switchMap(() => this.request$),
      tap(({id, name}) => this.title.setTitle(name || "Заявка №" + id)),
      tap(({id, number}) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/backoffice" },
        { label: `Заявка №${number}`, link: "/requests/backoffice/" + id }
      ]),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
