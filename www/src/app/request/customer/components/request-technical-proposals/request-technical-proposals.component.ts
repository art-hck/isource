import { Component, OnInit } from '@angular/core';
import { UxgBreadcrumbsService } from "uxg";
import { ActivatedRoute } from "@angular/router";
import { Uuid } from "../../../../cart/models/uuid";

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
      { label: 'Заявки', link: `/requests/customer` },
      { label: 'Заявка', link: `/requests/customer/${this.requestId}/new` },
      { label: 'Согласование технических предложений', link: `/requests/customer/${this.requestId}/new/technical-proposals` }
    ];
  }

}
