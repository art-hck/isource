import { ActivatedRoute } from "@angular/router";
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { tap } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { FeatureService } from "../../../../core/services/feature.service";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { RequestPosition } from "../../../common/models/request-position";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";

@Component({
  templateUrl: './technical-commercial-proposal-list.component.html',
  styleUrls: ['technical-commercial-proposal-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalListComponent implements OnInit {
  @Select(TechnicalCommercialProposalState.getList)
  technicalCommercialProposals$: Observable<TechnicalCommercialProposal[]>;
  @Select(TechnicalCommercialProposalState.proposalsLength)
  proposalsLength$: Observable<number>;
  requestId: Uuid;
  request$: Observable<Request>;
  showForm;

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private featureService: FeatureService,
    private store: Store,
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

    this.store.dispatch(new TechnicalCommercialProposals.Fetch(this.requestId));
  }

  getPositions(proposals: TechnicalCommercialProposal[]): RequestPosition[] {
    return proposals
      .map(proposal => proposal.positions.map(proposalPosition => proposalPosition.position))
      .reduce((prev, curr) => [...prev, ...curr], []);
  }

  getContragents(proposals: TechnicalCommercialProposal[]): ContragentShortInfo[] {
    return proposals
      .map(proposal => proposal.supplier);
  }

  trackByProposalId = (i, proposal: TechnicalCommercialProposal) => proposal.id;
}
