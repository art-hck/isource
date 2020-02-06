import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Observable, of } from "rxjs";
import { UxgBreadcrumbsService } from "uxg";
import { tap } from "rxjs/operators";
import { RequestPosition } from "../../../common/models/request-position";
import { RequestService } from "../../services/request.service";
import { Uuid } from "../../../../cart/models/uuid";

@Component({ templateUrl: './request-position.component.html' })
export class RequestPositionComponent implements OnInit {
  requestId: Uuid;
  positionId: Uuid;
  position$: Observable<RequestPosition>;

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
    this.setPageInfo(position);
    this.position$ = of(position);
  }

  setPageInfo(position: RequestPosition) {
    this.title.setTitle(position.name);

    this.bc.breadcrumbs = [
      { label: 'Заявки', link: `/requests/customer` },
      { label: `Заявка №${position.request.number}`, link: `/requests/customer/${this.requestId}` },
      { label: position.name, link: `/requests/customer/${this.requestId}/${position.id}` }
    ];
  }
}
