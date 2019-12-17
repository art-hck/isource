import { ActivatedRoute } from "@angular/router";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Observable, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { RequestPosition } from "../../../common/models/request-position";
import { RequestPositionWorkflowStepLabels } from "../../../common/dictionaries/request-position-workflow-step-labels";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "../../../../ux-guidlines/components/uxg-breadcrumbs/uxg-breadcrumbs.service";

@Component({ templateUrl: './request-position.component.html' })
export class RequestPositionComponent implements OnInit, OnDestroy {
  requestId: Uuid;
  positionId: Uuid;
  position$: Observable<RequestPosition>;
  subsription = new Subscription();
  statuses = Object.entries(RequestPositionWorkflowStepLabels);

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private title: Title,
    private bc: UxgBreadcrumbsService
  ) {}

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.positionId = this.route.snapshot.paramMap.get('position-id');
    this.position$ = this.requestService.getRequestPosition(this.positionId).pipe(
      tap(position => {
        this.title.setTitle(position.name);

        this.bc.breadcrumbs = [
          { label: 'Заявки', link: `/requests/backoffice` },
          { label: 'Заявка', link: `/requests/backoffice/${this.requestId}/new`},
          { label: position.name, link: `/requests/backoffice/${this.requestId}/new/${position.id}` }
        ];
      })
    );

  }

  changeStatus(data: {status, position}) {
    data.position.statusLabel = data.status.label;
    data.position.status = data.status.value;

    this.subsription.add(
      this.requestService.changeStatus(this.requestId, data.position.id, data.position.status).subscribe()
    );
  }

  ngOnDestroy() {
    this.subsription.unsubscribe();
  }
}
