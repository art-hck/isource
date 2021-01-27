import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Observable, of } from "rxjs";
import { RequestPosition } from "../../../common/models/request-position";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../../customer/services/request.service";
import { Title } from "@angular/platform-browser";
import { UxgBreadcrumbsService } from "uxg";
import { Store } from "@ngxs/store";
import { tap } from "rxjs/operators";

@Component({
  templateUrl: './position.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private store: Store
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

  setPageInfo(position: RequestPosition) {
    this.title.setTitle(position.name);

    this.bc.breadcrumbs = [
      { label: 'Заявки', link: `/requests/approver` },
      { label: `Заявка №${position.request.number}`, link: `/requests/approver/${this.requestId}` },
      { label: position.name, link: `/requests/approver/${this.requestId}/${position.id}` }
    ];
  }

}
