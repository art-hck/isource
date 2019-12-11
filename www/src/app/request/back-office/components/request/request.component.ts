import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestPositionList } from "../../../common/models/request-position-list";
import { RequestService } from "../../services/request.service";
import { ActivatedRoute } from "@angular/router";
import { publishReplay, refCount, tap } from "rxjs/operators";
import { Title } from "@angular/platform-browser";
import { UxgBreadcrumbsService } from "../../../../ux-guidlines/components/uxg-breadcrumbs/uxg-breadcrumbs.service";

@Component({
  templateUrl: './request.component.html'
})
export class RequestComponent implements OnInit {

  request$: Observable<Request>;
  positions$: Observable<RequestPositionList[]>;

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
          { label: "Заявки", link: "/requests/backoffice" },
          { label: this.title.getTitle(), link: "/requests/backoffice/" + request.id }
        ];
      })
    );
    this.positions$ = this.requestService.getRequestPositions(requestId).pipe(
      publishReplay(1), refCount()
    );
  }
}
