import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UxgBreadcrumbsService } from "uxg";
import { Uuid } from "../../../../cart/models/uuid";

@Component({ templateUrl: './commercial-proposal-list.component.html' })
export class CommercialProposalListComponent implements OnInit {
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
      { label: 'Заявка', link: `/requests/customer/${this.requestId}` },
      { label: 'Согласование коммерческих предложений', link: `/requests/customer/${this.requestId}/new/commercial-proposals` }
    ];
  }

}
