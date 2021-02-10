import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Observable, of } from "rxjs";
import { RequestPosition } from "../../../common/models/request-position";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../../customer/services/request.service";
import { Title } from "@angular/platform-browser";
import { UxgBreadcrumbsService } from "uxg";
import { Store } from "@ngxs/store";
import { switchMap, tap } from "rxjs/operators";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { PositionStatus } from "../../../common/enum/position-status";
import { PositionService } from "../../../back-office/services/position.service";

@Component({
  templateUrl: './position.component.html',
})
export class PositionComponent implements OnInit {
  requestId: Uuid;
  positionId: Uuid;
  position$: Observable<RequestPosition>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private title: Title,
    private bc: UxgBreadcrumbsService,
    private store: Store,
    private positionService: PositionService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(() => this.getData());
  }

  getData() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.positionId = this.route.snapshot.paramMap.get('position-id');
    this.position$ = this.requestService.getRequestPosition(this.requestId, this.positionId)
      .pipe(tap(position => this.setPageInfo(position)));
  }

  setPageInfo(position: RequestPosition) {
    this.title.setTitle(position.name);

    this.bc.breadcrumbs = [
      { label: 'Заявки', link: `/requests/approver` },
      { label: `Заявка №${position.request.number}`, link: `/requests/approver/${this.requestId}`, queryParams: {
          showOnlyApproved: position.status === "PROOF_OF_NEED" ? '0' : '1'
        } },
      { label: position.name, link: `/requests/approver/${this.requestId}/${position.id}` }
    ];
  }

  rejectPositions(positionIds: Uuid[]) {
    this.positionService.changePositionsStatus(positionIds, 'CANCELED', 'customer').pipe(tap(() => {
      this.store.dispatch(new ToastActions.Success('Позиция отклонена'));
      this.position$ = this.requestService.getRequestPosition(this.requestId, this.positionId);
    })).subscribe();
  }

  approvePositions(positionIds: Uuid[]) {
    this.requestService.changePositionsStatus(positionIds, PositionStatus.NEW).pipe(tap(() => {
      this.store.dispatch(new ToastActions.Success('Позиция успешно согласована'));
      this.position$ = this.requestService.getRequestPosition(this.requestId, this.positionId);
    })).subscribe();
  }
}
