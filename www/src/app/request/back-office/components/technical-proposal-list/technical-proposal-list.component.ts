import { ActivatedRoute } from "@angular/router";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, mapTo, publishReplay, refCount, switchMap, takeUntil, tap } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { RequestPosition } from "../../../common/models/request-position";
import { ContragentList } from "../../../../contragent/models/contragent-list";
import { ContragentService } from "../../../../contragent/services/contragent.service";
import { FeatureService } from "../../../../core/services/feature.service";
import { RequestActions } from "../../actions/request.actions";
import { Select, Store } from "@ngxs/store";
import { RequestState } from "../../states/request.state";

@Component({ templateUrl: './technical-proposal-list.component.html' })
export class TechnicalProposalListComponent implements OnInit, OnDestroy {
  @Select(RequestState.request) request$: Observable<Request>;
  readonly destroy$ = new Subject();
  requestId: Uuid;
  technicalProposals$: Observable<TechnicalProposal[]>;
  positions$: Observable<RequestPosition[]>;
  contragents$: Observable<ContragentList[]>;
  showForm = false;

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private technicalProposalsService: TechnicalProposalsService,
    private contragentService: ContragentService,
    public featureService: FeatureService,
    public store: Store
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(({id}) => this.requestId = id),
      switchMap(({id}) => this.store.dispatch(new RequestActions.Fetch(id))),
      switchMap(() => this.request$),
      filter(request => !!request),
      tap(({id, number}) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/backoffice" },
        { label: `Заявка №${number}`, link: `/requests/backoffice/${id}` },
        { label: 'Согласование технических предложений', link: `/requests/backoffice/${id}/technical-proposals` }
      ]),
      tap(() => {
        this.getTechnicalProposals();
        this.getTechnicalProposalsPositions();
        this.getTechnicalProposalsContragents();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getTechnicalProposals(filters = {}) {
    this.technicalProposals$ = this.technicalProposalsService.getTechnicalProposalsList(this.requestId, filters).pipe(
      tap(technicalProposals => this.showForm = technicalProposals.length === 0),
      publishReplay(1), refCount()
    );
  }

  filter(filters: {}) {
    this.technicalProposalsService.getTechnicalProposalsList(this.requestId, filters).subscribe(data => {
      this.technicalProposals$ = this.technicalProposals$.pipe(mapTo(data));
    });
  }

  getTechnicalProposalsPositions() {
    this.positions$ = this.technicalProposalsService.getTechnicalProposalsPositionsList(this.requestId);
  }

  getTechnicalProposalsContragents() {
    this.contragents$ = this.contragentService.getContragentList();
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

  /**
   * @TODO uncomment when backend return technicalProposal data
   */
  updateTechnicalProposal(technicalProposal) {
    this.getTechnicalProposals();
    // this.technicalProposals$ = this.technicalProposals$.pipe(
    //   map(technicalProposals => {
    //     const i = technicalProposals.findIndex(_technicalProposal => _technicalProposal.id === technicalProposal.id);
    //     technicalProposals[i] = technicalProposal;
    //
    //     return technicalProposals;
    //   }),
    //   publishReplay(1), refCount()
    // );
  }

  onCancelPublishTechnicalProposal(technicalProposal: TechnicalProposal) {
    const subscription = this.technicalProposalsService.cancelSendToAgreement(this.requestId, technicalProposal).subscribe(
      () => {
        this.getTechnicalProposals();
        subscription.unsubscribe();
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
