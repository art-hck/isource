import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Observable, of, Subscription } from "rxjs";
import { UxgBreadcrumbsService } from "uxg";
import { switchMap, tap } from "rxjs/operators";
import { RequestPosition } from "../../../common/models/request-position";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { PositionStatusesLabels } from "../../../common/dictionaries/position-statuses-labels";
import { RequestDocument } from "../../../common/models/request-document";
import { Store } from "@ngxs/store";
import { RequestActions } from "../../actions/request.actions";

@Component({ templateUrl: './position.component.html' })
export class PositionComponent implements OnInit, OnDestroy {
  requestId: Uuid;
  positionId: Uuid;
  position$: Observable<RequestPosition>;
  subscription = new Subscription();
  statuses = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private title: Title,
    private store: Store,
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
      .pipe(tap(position => {
        this.setPageInfo(position);
        this.updateAvailableStatuses(position);
      }));
  }

  updateData(position: RequestPosition) {
    this.setPageInfo(position);
    this.position$ = of(position);
  }

  updateAvailableStatuses(position: RequestPosition) {
    this.statuses = Object.entries(PositionStatusesLabels)
      .filter(item => position.availableStatuses.indexOf(item[0]) >= 0);
  }

  setPageInfo(position: RequestPosition) {
    this.title.setTitle(position.name);

    this.bc.breadcrumbs = [
      { label: 'Заявки', link: `/requests/backoffice` },
      { label: `Заявка №${position.request.number}`, link: `/requests/backoffice/${this.requestId}`},
      { label: position.name, link: `/requests/backoffice/${this.requestId}/${position.id}` }
    ];
  }

  changeStatus(data: {status, position}) {
    data.position.statusLabel = data.status.label;
    data.position.status = data.status.value;

    this.requestService.changeStatus(this.requestId, data.position.id, data.position.status).subscribe(
      (response: any) => {
        data.position.availableStatuses = response.availableStatuses;
        this.updateAvailableStatuses(data.position);

        this.position$ = of(data.position);
      }
    );
  }

  uploadDocuments({files, position}: {files: File[], position: RequestPosition}) {
    this.requestService.uploadDocuments(position, files)
      .subscribe((documents: RequestDocument[]) => {
        position.documents.push(...documents);
        this.position$ = of(position);
      });
  }

  // @TODO На данном этапе отправляем на согласование сразу всю заявку, ждём попозиционный бэк
  sendOnApprove = (position: RequestPosition): Observable<RequestPosition> => this.store
    .dispatch(new RequestActions.Publish(this.requestId, false)).pipe(
      switchMap(() => this.requestService.getRequestPosition(this.requestId, position.id))
    )

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
