import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { RequestService } from "../../services/request.service";
import { ActivatedRoute } from "@angular/router";
import { filter, switchMap, takeUntil, tap } from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import { UxgBreadcrumbsService } from "uxg";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestActions } from "../../actions/request.actions";
import { RequestState } from "../../states/request.state";
import { StateStatus } from "../../../common/models/state-status";
import { RequestComponent as CommonRequestComponent } from "../../../common/components/request/request.component";
import UploadFromTemplate = RequestActions.UploadFromTemplate;
import Publish = RequestActions.Publish;
import RefreshPositions = RequestActions.RefreshPositions;
import Refresh = RequestActions.Refresh;
import Fetch = RequestActions.Fetch;
import FetchPositions = RequestActions.FetchPositions;
import Approve = RequestActions.Approve;
import PublishPositions = RequestActions.PublishPositions;
import ApprovePositions = RequestActions.ApprovePositions;
import RejectPositions = RequestActions.RejectPositions;
import AttachDocuments = RequestActions.AttachDocuments;
import Reject = RequestActions.Reject;
import CreateTemplate = RequestActions.CreateTemplate;
import { ToastActions } from "../../../../shared/actions/toast.actions";
import EditRequestName = RequestActions.EditRequestName;

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
  readonly publish = id => new Publish(id);
  readonly approve = id => new Approve(id);
  readonly publishPositions = positions => new PublishPositions(this.requestId, positions);
  readonly approvePositions = positions => new ApprovePositions(this.requestId, positions);
  readonly rejectPositions = data => new RejectPositions(this.requestId, data.positionIds, data.rejectionMessage);
  readonly attachDocuments = ({positionIds, files}) => new AttachDocuments(this.requestId, positionIds, files);
  readonly saveRequestName = data => new EditRequestName(this.requestId, data);
  readonly reject = id => new Reject(id);
  readonly createTemplate = (positions, title, tag?) => new CreateTemplate(this.requestId, positions.map(position => position.id), title, tag);
  readonly uploadFromTemplate = ({files}) => new UploadFromTemplate(this.requestId, files);
  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private bc: UxgBreadcrumbsService,
    private actions: Actions,
    public store: Store,
    private title: Title
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(({id}) => this.requestId = id),
      switchMap(({id}) => this.store.dispatch([new Fetch(id), new FetchPositions(id)])),
      switchMap(() => this.request$),
      filter(request => !!request),
      tap(({id, name}) => this.title.setTitle(name || "Заявка №" + id)),
      tap(({id, number}) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/customer" },
        { label: `Заявка №${number}`, link: "/requests/customer/" + id }
      ]),
      takeUntil(this.destroy$),
    ).subscribe();

    this.actions.pipe(
      ofActionCompleted(AttachDocuments),
      takeUntil(this.destroy$)
    ).subscribe(({result, action}) => {
      const e = result.error as any;

      const pluralizedFilesTextPart = action.files.length > 1 ? 'Файлы успешно прикреплены ' : 'Файл успешно прикреплён ';
      const pluralizedPositionsTextPart = action.positionIds.length > 1 ? 'к выбранным позициям' : 'к выбранной позиции';
      const text = pluralizedFilesTextPart + pluralizedPositionsTextPart;

      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) :
        new ToastActions.Success(text)
      );

      this.commonRequestComponent.resetSelectedPositions();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
