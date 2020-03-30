import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { tap } from "rxjs/operators";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";

@Component({ templateUrl: './technical-proposal-list.component.html' })
export class TechnicalProposalListComponent implements OnInit {
  requestId: Uuid;
  technicalProposals$: Observable<TechnicalProposal[]>;
  request$: Observable<Request>;

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private technicalProposalsService: TechnicalProposalsService
  ) {
    this.requestId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.request$ = this.requestService.getRequest(this.requestId).pipe(
      tap(request => {
        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/customer" },
          { label: `Заявка №${request.number}`, link: `/requests/customer/${request.id}` },
          { label: 'Согласование технических предложений', link: `/requests/customer/${this.requestId}/technical-proposals` }
        ];
      }));

    this.getTechnicalProposals();
  }

  getTechnicalProposals() {
    this.technicalProposals$ = this.technicalProposalsService.getTechnicalProposalsList(this.requestId);
  }
}
