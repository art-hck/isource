import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
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
import { RequestPosition } from "../../../common/models/request-position";

@Component({
  templateUrl: './request.component.html'
})
export class RequestComponent implements OnInit {

  request$: Observable<Request>;
  positions$: Observable<RequestPositionList[]>;
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
    this.request$ = this.getRequest();
    this.positions$ = this.getPositions();
  }

  getRequest() {
    return this.requestService.getRequestInfo(this.requestId).pipe(
      tap(request => {
        this.title.setTitle(request.name || "Заявка №" + request.id);

        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/backoffice" },
          { label: `Заявка №${request.number}`, link: "/requests/backoffice/" + request.id }
        ];
      })
    );
  }

  getPositions() {
    return this.requestService.getRequestPositions(this.requestId);
  }

  uploadFromTemplate(requestData: { files: File[], requestName: string }) {
    this.positions$ = this.createRequestPositionService
      .addBackofficeRequestPositionsFromExcel(this.requestId, requestData.files).pipe(
        catchError((e) => {
          this.notificationService.toast(
            'Ошибка в шаблоне' + (e && e.error && e.error.detail || ""), "error"
          );
          return null;
        }),
        switchMap(() => this.getPositions())
      );
  }

  // @TODO На данном этапе публикуем сразу всю заявку, ждём попозиционный бэк
  sendOnApprove = (position: RequestPosition) => this.requestService
    .publishRequest(this.requestId)
    // После публикации получаем актуальную инфу о позиции
    .pipe(switchMap(() => this.requestService.getRequestPosition(this.requestId, position.id)))
}
