import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Observable, Subscription } from "rxjs";
import { UxgBreadcrumbsService } from "uxg";
import { mapTo, switchMap, tap } from "rxjs/operators";
import { RequestPosition } from "../../../common/models/request-position";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestPositionWorkflowStepLabels } from "../../../common/dictionaries/request-position-workflow-step-labels";

@Component({ templateUrl: './request-position.component.html' })
export class RequestPositionComponent implements OnInit, OnDestroy {
  requestId: Uuid;
  positionId: Uuid;
  position$: Observable<RequestPosition>;
  subscription = new Subscription();
  statuses = Object.entries(RequestPositionWorkflowStepLabels);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private title: Title,
    private bc: UxgBreadcrumbsService
  ) {
    this.route.params.subscribe(() => this.getData());
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.positionId = this.route.snapshot.paramMap.get('position-id');
    this.position$ = this.requestService.getRequestPosition(this.requestId, this.positionId)
      .pipe(tap(position => this.setPageInfo(position)));
  }

  updateData(position: RequestPosition) {
    this.position$ = this.position$.pipe(mapTo(position));
  }

  setPageInfo(position: RequestPosition) {
    this.title.setTitle(position.name);

    this.bc.breadcrumbs = [
      { label: 'Заявки', link: `/requests/backoffice` },
      { label: `Заявка №${position.request.number}`, link: `/requests/backoffice/${this.requestId}/new`},
      { label: position.name, link: `/requests/backoffice/${this.requestId}/new/${position.id}` }
    ];
  }

  changeStatus(data: {status, position}) {
    data.position.statusLabel = data.status.label;
    data.position.status = data.status.value;

    this.subscription.add(
      this.requestService.changeStatus(this.requestId, data.position.id, data.position.status).subscribe()
    );
  }

  // @TODO На данном этапе публикуем сразу всю заявку, ждём попозиционный бэк
  publish = (position: RequestPosition) => this.requestService
    .publishRequest(this.requestId)
    // После публикации получаем актуальную инфу о позиции
    .pipe(switchMap(() => this.requestService.getRequestPosition(this.requestId, position.id)))

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
