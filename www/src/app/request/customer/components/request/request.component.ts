import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { RequestService } from "../../services/request.service";
import { ActivatedRoute } from "@angular/router";
import { catchError, switchMap, tap } from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import { UxgBreadcrumbsService } from "uxg";
import { CreateRequestPositionService } from "../../../common/services/create-request-position.service";
import { NotificationService } from "../../../../shared/services/notification.service";
import { Uuid } from "../../../../cart/models/uuid";

@Component({
  templateUrl: './request.component.html'
})
export class RequestComponent implements OnInit, OnDestroy {

  request$: Observable<Request>;
  positions$: Observable<RequestPositionList[]>;
  subscription = new Subscription();
  requestId: Uuid;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private createRequestPositionService: CreateRequestPositionService,
    private bc: UxgBreadcrumbsService,
    private notificationService: NotificationService,
    private title: Title
  ) {}

  ngOnInit() {
    this.requestId = this.route.snapshot.paramMap.get('id');

    this.request$ = this.requestService.getRequestInfo(this.requestId).pipe(
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
    this.positions$ = this.requestService.getRequestPositions(this.requestId);
  }

  publish(request: Request) {
    this.subscription.add(this.requestService
      .publishRequest(request.id).subscribe(() => this.getPositions()));
  }

  uploadFromTemplate(requestData: { files: File[], requestName: string }) {
    this.positions$ = this.createRequestPositionService
      .addCustomerRequestPositionsFromExcel(this.requestId, requestData.files).pipe(
        catchError((e) => {
          this.notificationService.toast(
            'Ошибка в шаблоне' + (e && e.error && e.error.detail || ""), "error"
          );
          return null;
        }),
        switchMap(() => this.requestService.getRequestPositions(this.requestId))
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
