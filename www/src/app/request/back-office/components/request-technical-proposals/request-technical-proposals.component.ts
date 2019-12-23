import { Component, OnInit } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { ActivatedRoute } from "@angular/router";
import { UxgBreadcrumbsService } from "uxg";

@Component({ templateUrl: './request-technical-proposals.component.html' })
export class RequestTechnicalProposalsComponent implements OnInit {
  requestId: Uuid;

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService
  ) {
    this.requestId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.bc.breadcrumbs = [
      { label: 'Заявки', link: `/requests/backoffice` },
      { label: 'Заявка', link: `/requests/backoffice/${this.requestId}/new` },
      { label: 'Согласование технических предложений', link: `/requests/backoffice/${this.requestId}/new/technical-proposals` }
    ];
  }

}
