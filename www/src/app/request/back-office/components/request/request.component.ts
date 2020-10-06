import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { RequestService } from "../../services/request.service";
import { ActivatedRoute } from "@angular/router";
import { switchMap, takeUntil, tap } from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import { UxgBreadcrumbsService } from "uxg";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestPosition } from "../../../common/models/request-position";
import { RequestActions } from "../../actions/request.actions";
import { RequestState } from "../../states/request.state";
import { StateStatus } from "../../../common/models/state-status";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { PluralizePipe } from "../../../../shared/pipes/pluralize-pipe";
import UploadFromTemplate = RequestActions.UploadFromTemplate;
import Publish = RequestActions.Publish;
import RefreshPositions = RequestActions.RefreshPositions;
import Refresh = RequestActions.Refresh;
import Fetch = RequestActions.Fetch;
import FetchPositions = RequestActions.FetchPositions;
import CreateTemplate = RequestActions.CreateTemplate;

@Component({
  templateUrl: './request.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestComponent implements OnInit, OnDestroy {
  requestId: Uuid;
  positions: RequestPosition[];
  @Select(RequestState.request) request$: Observable<Request>;
  @Select(RequestState.positions) positions$: Observable<RequestPositionList[]>;
  @Select(RequestState.status) status$: Observable<StateStatus>;
  @Select(RequestState.positionsStatus) positionsStatus$: Observable<StateStatus>;
  readonly destroy$ = new Subject();
  readonly refresh = id => new Refresh(id);
  readonly refreshPositions = id => new RefreshPositions(id);
  readonly publish = (id, positions) => new Publish(id, true, positions.map(position => position.id));
  readonly uploadFromTemplate = ({files}) => new UploadFromTemplate(this.requestId, files);
  readonly createTemplate = (positions, title, tag?) => new CreateTemplate(this.requestId, positions.map(position => position.id), title, tag)
  readonly sendOnApprove = (position: RequestPosition): Observable<RequestPosition> => this.store
    .dispatch(new Publish(this.requestId, false, [position.id])).pipe(
      switchMap(() => this.requestService.getRequestPosition(this.requestId, position.id))
    )

  constructor(
    public store: Store,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private bc: UxgBreadcrumbsService,
    private title: Title,
    private actions: Actions
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

    this.actions.pipe(
      ofActionCompleted(Publish),
      takeUntil(this.destroy$)
    ).subscribe(({result, action}) => {
      const e = result.error as any;
      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) :
        new ToastActions.Success(action.positions.length > 1 ? action.positions.length + '  позиции отправлено на согласование' :
          'Позиция отправлена на согласование')
      );
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
