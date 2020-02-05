import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { map, publishReplay, refCount, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";

@Component({ templateUrl: './request-technical-proposals.component.html' })
export class RequestTechnicalProposalsComponent implements OnInit {
  requestId: Uuid;
  technicalProposals$: Observable<TechnicalProposal[]>;
  request$: Observable<Request>;
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
          { label: `Заявка №${request.number}`, link: `/requests/backoffice/${request.id}` },
          { label: 'Согласование технических предложений', link: `/requests/backoffice/${this.requestId}/technical-proposals` }
        ];
      }));

    this.getTechnicalProposals();
  }

  getTechnicalProposals(filters = {}) {
    this.technicalProposals$ = this.technicalProposalsService.getTechnicalProposalsList(this.requestId, filters).pipe(
      tap(technicalProposals => this.showForm = technicalProposals.length === 0),
      publishReplay(1), refCount()
    );
  }

  /**
   * @TODO uncomment when backend return technicalProposal data
   */
  addTechnicalProposal(technicalProposal) {
    this.getTechnicalProposals();
    // this.technicalProposals$ = this.technicalProposals$.pipe(
    //   map(technicalProposals => {
    //     technicalProposals.unshift(technicalProposal);
    //     return technicalProposals;
    //   })
    // );
  }

  updateTechnicalProposal(technicalProposal) {
    this.technicalProposals$ = this.technicalProposals$.pipe(
      map(technicalProposals => {
        const i = technicalProposals.findIndex(_technicalProposal => _technicalProposal.id === technicalProposal.id);
        technicalProposals[i] = technicalProposal;

        return technicalProposals;
      }),
      publishReplay(1), refCount()
    );
  }
}
