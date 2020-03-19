import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { tap } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";

@Component({templateUrl: './technical-commercial-proposal-list.component.html'})
export class TechnicalCommercialProposalListComponent implements OnInit {

  requestId: Uuid;
  request$: Observable<Request>;

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
  ) {
    this.requestId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.request$ = this.requestService.getRequestInfo(this.requestId).pipe(
      tap(request => {
        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/customer" },
          { label: `Заявка №${request.number}`, link: `/requests/customer/${request.id}` },
          { label: 'Согласование технико-коммерческих предложений', link: `/requests/customer/${this.requestId}/technical-commercial-proposals` }
        ];
      })
    );
  }
}
