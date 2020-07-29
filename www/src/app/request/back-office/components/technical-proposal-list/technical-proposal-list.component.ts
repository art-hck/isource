import { ActivatedRoute } from "@angular/router";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, finalize, mapTo, publishReplay, refCount, switchMap, takeUntil, tap } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { TechnicalProposalsService } from "../../services/technical-proposals.service";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { RequestPosition } from "../../../common/models/request-position";
import { FeatureService } from "../../../../core/services/feature.service";
import { RequestActions } from "../../actions/request.actions";
import { Select, Store } from "@ngxs/store";
import { RequestState } from "../../states/request.state";
import { ProcedureSource } from "../../enum/procedure-source";
import { TechnicalProposalFilter } from "../../../common/models/technical-proposal-filter";
import { Procedure } from "../../models/procedure";
import { ProcedureService } from "../../services/procedure.service";
import { ProcedureAction } from "../../models/procedure-action";
import { StateStatus } from "../../../common/models/state-status";
import { TechnicalProposalsStatus } from "../../../common/enum/technical-proposals-status";

@Component({
  templateUrl: './technical-proposal-list.component.html',
  styleUrls: ['technical-proposal-list.component.scss']
})
export class TechnicalProposalListComponent implements OnInit, OnDestroy {
  @Select(RequestState.request) request$: Observable<Request>;
  readonly destroy$ = new Subject();
  requestId: Uuid;
  technicalProposals$: Observable<TechnicalProposal[]>;
  technicalProposalAvailableStatuses$: Observable<TechnicalProposalsStatus[]>;
  procedures$: Observable<Procedure[]>;
  positions$: Observable<RequestPosition[]>;
  showForm = false;
  procedureSource = ProcedureSource;
  procedureModalPayload: ProcedureAction & { procedure?: Procedure };
  prolongModalPayload: Procedure;
  state: StateStatus = "pristine";

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private technicalProposalsService: TechnicalProposalsService,
    private procedureService: ProcedureService,
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
        this.fetch();
        this.fetchAvailableStatusesList();
        this.fetchProcedures();
        this.fetchPositions();
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  fetch(filters: TechnicalProposalFilter = {}) {
    this.technicalProposals$ = this.technicalProposalsService.getTechnicalProposalsList(this.requestId, filters).pipe(
      publishReplay(1), refCount()
    );
  }

  fetchAvailableStatusesList(filters: TechnicalProposalFilter = {}) {
    this.technicalProposalAvailableStatuses$ = this.technicalProposalsService.getTechnicalProposalsAvailableStatuses(this.requestId, filters).pipe(
      publishReplay(1), refCount()
    );
  }

  fetchProcedures() {
    this.procedures$ = this.procedureService.list(this.requestId, ProcedureSource.TECHNICAL_PROPOSAL).pipe(
      publishReplay(1), refCount()
    );
  }

  refreshProcedures() {
    this.state = "updating";
    this.procedureService.list(this.requestId, ProcedureSource.TECHNICAL_PROPOSAL)
      .pipe(finalize(() => this.state = "received"))
      .subscribe((data) => {
        this.procedures$ = this.procedures$.pipe(mapTo(data));
        this.fetchPositions();
      });
  }

  filter(filters: TechnicalProposalFilter) {
    this.technicalProposalsService.getTechnicalProposalsList(this.requestId, filters).subscribe(data => {
      this.technicalProposals$ = this.technicalProposals$.pipe(mapTo(data));
    });

    // Обновляем список доступных статусов, учитывая отмеченных заказчиков
    const filtersByContragents = filters.contragents ? { contragents: filters.contragents } : {};

    this.fetchAvailableStatusesList(filtersByContragents);
  }

  fetchPositions() {
    this.positions$ = this.technicalProposalsService.getTechnicalProposalsPositionsList(this.requestId);
  }

  /**
   * @TODO uncomment when backend return technicalProposal data
   */
  addTechnicalProposal(technicalProposal) {
    this.fetch();
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
    this.fetch();
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
        this.fetch();
        subscription.unsubscribe();
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
