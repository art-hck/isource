import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { RequestService } from "../../services/request.service";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import { UxgBreadcrumbsService } from "uxg";

@Component({
  templateUrl: './request.component.html'
})
export class RequestComponent implements OnInit, OnDestroy {

  request$: Observable<Request>;
  positions$: Observable<RequestPositionList[]>;
  subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private bc: UxgBreadcrumbsService,
    private title: Title
  ) {}

  ngOnInit() {
    const requestId = this.route.snapshot.paramMap.get('id');

    this.request$ = this.requestService.getRequestInfo(requestId).pipe(
      tap(request => {
        this.title.setTitle(request.name || "Заявка №" + request.id);

        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/customer" },
          { label: this.title.getTitle(), link: "/requests/customer/" + request.id }
        ];
      })
    );
    this.getPositions();
  }

  getPositions() {
    const requestId = this.route.snapshot.paramMap.get('id');

    this.positions$ = this.requestService.getRequestPositions(requestId);
  }

  publish(request: Request) {
    this.subscription.add(this.requestService
      .publishRequest(request.id).subscribe(() => this.getPositions()));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
