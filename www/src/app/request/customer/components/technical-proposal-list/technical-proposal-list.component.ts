import { ActivatedRoute } from "@angular/router";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, switchMap, takeUntil, tap } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { TechnicalProposals } from "../../actions/technical-proposal.actions";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { RequestPosition } from "../../../common/models/request-position";
import { FeatureService } from "../../../../core/services/feature.service";
import { RequestActions } from "../../actions/request.actions";
import { Select, Store } from "@ngxs/store";
import { RequestState } from "../../states/request.state";
import { TechnicalProposalsStatus } from "../../../common/enum/technical-proposals-status";
import { TechnicalProposalState } from "../../states/technical-proposal.state";
import { StateStatus } from "../../../common/models/state-status";
import Fetch = TechnicalProposals.Fetch;
import Update = TechnicalProposals.Update;

@Component({
  templateUrl: './technical-proposal-list.component.html',
  styleUrls: ['./technical-proposal-list.component.scss'],
})
export class TechnicalProposalListComponent implements OnInit, OnDestroy {
  @Select(TechnicalProposalState.status)
  readonly stateStatus$: Observable<StateStatus>;

  @Select(RequestState.request)
  readonly request$: Observable<Request>;

  @Select(TechnicalProposalState.proposalsByStatus([TechnicalProposalsStatus.SENT_TO_REVIEW]))
  readonly proposalsSentToReview$: Observable<TechnicalProposal[]>;

  @Select(TechnicalProposalState.proposalsByStatus([
    TechnicalProposalsStatus.ACCEPTED,
    TechnicalProposalsStatus.PARTIALLY_ACCEPTED,
    TechnicalProposalsStatus.CANCELED
  ]))
  readonly proposalsReviewed$: Observable<TechnicalProposal[]>;

  @Select(TechnicalProposalState.proposals)
  readonly technicalProposals$: Observable<TechnicalProposal[]>;

  readonly destroy$ = new Subject();
  requestId: Uuid;
  positions$: Observable<RequestPosition[]>;
  technicalProposalsStatus = TechnicalProposalsStatus;
  activeTab = 'SENT_TO_REVIEW';

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    public featureService: FeatureService,
    public store: Store
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(({id}) => this.requestId = id),
      tap(({id}) => this.store.dispatch(new Fetch(id))),
      switchMap(({id}) => this.store.dispatch(new RequestActions.Fetch(id))),
      switchMap(() => this.request$),
      filter(request => !!request),
      tap(({id, number}) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/customer" },
        { label: `Заявка №${number}`, link: `/requests/customer/${id}` },
        { label: 'Согласование технических предложений', link: `/requests/customer/${id}/technical-proposals` }
      ]),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getActiveList$(): Observable<TechnicalProposal[]> {
    switch (this.activeTab) {
      case this.technicalProposalsStatus.SENT_TO_REVIEW:
        return this.proposalsSentToReview$;
      case this.technicalProposalsStatus.ACCEPTED:
        return this.proposalsReviewed$;
      default:
        return this.proposalsSentToReview$;
    }
  }

  filter(filters: {}) {
    this.store.dispatch(new Update(this.requestId, filters));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
