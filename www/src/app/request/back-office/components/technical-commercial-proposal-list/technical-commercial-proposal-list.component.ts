import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { shareReplay, tap } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { FeatureService } from "../../../../core/services/feature.service";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalsService } from "../../services/technical-commercial-proposals.service";

@Component({templateUrl: './technical-commercial-proposal-list.component.html'})
export class TechnicalCommercialProposalListComponent implements OnInit {

  requestId: Uuid;
  request$: Observable<Request>;
  technicalCommercialProposals$: Observable<TechnicalCommercialProposal[]>;
  showForm = false;

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private featureService: FeatureService,
    private technicalCommercialProposalsService: TechnicalCommercialProposalsService,
  ) {
    this.requestId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.request$ = this.requestService.getRequestInfo(this.requestId).pipe(
      tap(request => {
        this.bc.breadcrumbs = [
          { label: "Заявки", link: "/requests/backoffice" },
          { label: `Заявка №${request.number}`, link: `/requests/backoffice/${request.id}` },
          { label: 'Согласование технико-коммерческих предложений', link: `/requests/backoffice/${this.requestId}/technical-commercial-proposals` }
        ];
      })
    );

    this.technicalCommercialProposals$ = this.technicalCommercialProposalsService.getList().pipe(
      tap(technicalCommercialProposals => this.showForm = technicalCommercialProposals.length === 0),
      shareReplay(1)
    );

    this.getTechnicalCommercialProposals();
  }

  getTechnicalCommercialProposals() {
    this.technicalCommercialProposals$ = this.technicalCommercialProposalsService.getList().pipe(
      tap(technicalCommercialProposals => this.showForm = technicalCommercialProposals.length === 0),
      shareReplay(1)
    );
  }
}
