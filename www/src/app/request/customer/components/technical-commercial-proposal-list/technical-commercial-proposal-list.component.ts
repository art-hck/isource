import { ActivatedRoute } from "@angular/router";
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { tap } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { StateStatus } from "../../../common/models/state-status";
import { TechnicalCommercialProposalGroupByPosition } from "../../../common/models/technical-commercial-proposal-group-by-position";
import { FormBuilder } from "@angular/forms";

@Component({
  templateUrl: './technical-commercial-proposal-list.component.html',
  styleUrls: ['technical-commercial-proposal-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalListComponent implements OnInit {

  requestId: Uuid;
  request$: Observable<Request>;
  @Select(TechnicalCommercialProposalState.getSentToReview)
  proposalsSentToReview$: Observable<TechnicalCommercialProposalGroupByPosition[]>;
  @Select(TechnicalCommercialProposalState.getReviewed)
  proposalsReviewed$: Observable<TechnicalCommercialProposalGroupByPosition[]>;
  @Select(TechnicalCommercialProposalState.status) stateStatus$: Observable<StateStatus>;

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private fb: FormBuilder,
    private requestService: RequestService,
    private store: Store,
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

    this.store.dispatch(new TechnicalCommercialProposals.Fetch(this.requestId));
  }

  trackByPositionId(i, item: TechnicalCommercialProposalGroupByPosition) {
    return item.position.id;
  }
}
