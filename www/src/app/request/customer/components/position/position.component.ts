import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { merge, Observable, of, Subject } from "rxjs";
import { UxgBreadcrumbsService } from "uxg";
import { switchMap, tap } from "rxjs/operators";
import { RequestPosition } from "../../../common/models/request-position";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";
import { RequestDocument } from "../../../common/models/request-document";
import { Store } from "@ngxs/store";
import { RequestActions } from "../../actions/request.actions";
import { PositionService } from "../../services/position.service";
import { PositionDocuments } from "../../../common/models/position-documents";

@Component({ templateUrl: './position.component.html' })
export class PositionComponent implements OnInit {
  requestId: Uuid;
  positionId: Uuid;
  position$: Observable<RequestPosition>;
  readonly documentsSubject$ = new Subject<PositionDocuments>();
  readonly documents$: Observable<PositionDocuments> = merge(this.documentsSubject$, this.route.params.pipe(
    switchMap(({ positionId }) => this.positionService.documents(positionId))));

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private positionService: PositionService,
    private title: Title,
    private bc: UxgBreadcrumbsService,
    private store: Store
  ) {
    this.route.params.subscribe(() => this.getData());
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    this.positionId = this.route.snapshot.paramMap.get('positionId');
    this.position$ = this.requestService.getRequestPosition(this.requestId, this.positionId)
      .pipe(tap(position => this.setPageInfo(position)));
  }

  updateData(position: RequestPosition) {
    this.setPageInfo(position);
    this.position$ = of(position);
    this.store.dispatch([
      new RequestActions.Refresh(this.requestId),
      new RequestActions.RefreshPositions(this.requestId),
    ]);
  }

  setPageInfo(position: RequestPosition) {
    this.title.setTitle(position.name);

    this.bc.breadcrumbs = [
      { label: 'Заявки', link: `/requests/customer` },
      { label: `Заявка №${position.request.number}`, link: `/requests/customer/${this.requestId}` },
      { label: position.name, link: `/requests/customer/${this.requestId}/${position.id}` }
    ];
  }

  uploadDocuments({files, position}: {files: File[], position: RequestPosition}) {
    this.position$ = of(position);
    this.positionService.uploadDocuments(position, files).pipe(
      switchMap(() => this.positionService.documents(position.id)),
      tap(docs => this.documentsSubject$.next(docs))
    ).subscribe();
  }
}
