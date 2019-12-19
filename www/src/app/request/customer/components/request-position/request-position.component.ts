import { Component, OnInit } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { RequestPosition } from "../../../common/models/request-position";
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { RequestService } from "../../services/request.service";
import { Title } from "@angular/platform-browser";
import { UxgBreadcrumbsService } from "uxg";
import { tap } from "rxjs/operators";

@Component({ templateUrl: './request-position.component.html' })
export class RequestPositionComponent implements OnInit {
  requestId: Uuid;
  position$: Observable<RequestPosition>;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private title: Title,
    private bc: UxgBreadcrumbsService
  ) {}

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');
    const positionId = this.route.snapshot.paramMap.get('position-id');

    this.position$ = this.requestService.getRequestPosition(positionId).pipe(
      tap(position => {
        this.title.setTitle(position.name);

        this.bc.breadcrumbs = [
          { label: 'Заявки', link: `/requests/customer` },
          { label: 'Заявка', link: `/requests/customer/${this.requestId}/new` },
          { label: position.name, link: `/requests/customer/${this.requestId}/new/${positionId}` }
        ];
      })
    );
  }
}
