import { ActivatedRoute } from "@angular/router";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { filter, switchMap, takeUntil, tap, throttleTime } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { FeatureService } from "../../../../core/services/feature.service";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { RequestPosition } from "../../../common/models/request-position";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import Create = TechnicalCommercialProposals.Create;
import Update = TechnicalCommercialProposals.Update;
import Publish = TechnicalCommercialProposals.Publish;

@Component({
  templateUrl: './technical-commercial-proposal-list.component.html',
  styleUrls: ['technical-commercial-proposal-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalListComponent implements OnInit, OnDestroy {
  @Select(TechnicalCommercialProposalState.proposals) technicalCommercialProposals$: Observable<TechnicalCommercialProposal[]>;
  @Select(TechnicalCommercialProposalState.proposalsLength) proposalsLength$: Observable<number>;
  @Select(RequestState.request) request$: Observable<Request>;
  readonly destroy$ = new Subject();
  requestId: Uuid;
  showForm: boolean;

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private featureService: FeatureService,
    private store: Store,
    private actions: Actions
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      tap(({id}) => this.requestId = id),
      tap(({id}) => this.store.dispatch(new TechnicalCommercialProposals.Fetch(id))),
      switchMap(({id}) => this.store.dispatch(new RequestActions.Fetch(id))),
      switchMap(() => this.request$),
      filter(request => !!request),
      tap(({id, number}) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/backoffice" },
        { label: `Заявка №${number}`, link: `/requests/backoffice/${id}` },
        { label: 'Согласование технико-коммерческих предложений', link: `/requests/backoffice/${this.requestId}/technical-commercial-proposals` }
      ])
    ).subscribe();

    this.actions.pipe(
      ofActionCompleted(Create, Update, Publish),
      throttleTime(1),
      takeUntil(this.destroy$)
    ).subscribe(({action, result}) => {
      const e = result.error as any;
      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) :
        new ToastActions.Success(`ТКП успешно ${action instanceof Publish ? 'отправлено' : 'сохранено'}`));
    });
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
