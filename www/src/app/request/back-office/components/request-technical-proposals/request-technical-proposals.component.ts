import { Component, OnInit } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { ActivatedRoute } from "@angular/router";
import { UxgBreadcrumbsService } from "uxg";
import { map, publishReplay, refCount, tap } from "rxjs/operators";
import { Request } from "../../../common/models/request";
import { Observable } from "rxjs";
import { RequestService } from "../../services/request.service";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { TechnicalProposal } from "../../../common/models/technical-proposal";

@Component({ templateUrl: './request-technical-proposals.component.html' })
export class RequestTechnicalProposalsComponent implements OnInit {
  requestId: Uuid;
  request$: Observable<Request>;
  technicalProposals$: Observable<TechnicalProposal[]>;
  showForm = false;

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private technicalProposalsService: TechnicalProposalsService
  ) {
    this.requestId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.request$ = this.requestService.getRequestInfo(this.requestId).pipe(
      tap(request => {
        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/backoffice" },
          { label: `Заявка №${request.number}`, link: `/requests/backoffice/${request.id}/new` },
          {
            label: 'Согласование технических предложений',
            link: `/requests/backoffice/${this.requestId}/new/technical-proposals`
          }
        ];
      })
    );

    this.technicalProposals$ = this.technicalProposalsService.getTechnicalProposalsList(this.requestId).pipe(
      tap(technicalProposals => this.showForm = technicalProposals.length === 0),
      publishReplay(1), refCount()
    );
  }

  addTechnicalProposal(technicalProposal) {
    this.technicalProposals$ = this.technicalProposals$.pipe(
      map(technicalProposals => [technicalProposal, ...technicalProposals])
    );
  }
}
