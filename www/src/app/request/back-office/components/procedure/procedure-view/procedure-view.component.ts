import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Uuid } from "../../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { ActivatedRoute, Router } from "@angular/router";
import { RequestService } from "../../../../customer/services/request.service";
import { ProcedureService } from "../../../services/procedure.service";
import { Procedure } from "../../../models/procedure";
import { Title } from "@angular/platform-browser";
import { ProposalSource } from "../../../enum/proposal-source";
import { ProcedureAction } from "../../../models/procedure-action";
import { Select, Store } from "@ngxs/store";
import { CommercialProposalState } from "../../../states/commercial-proposal.state";
import { Observable, of, Subject } from "rxjs";
import { StateStatus } from "../../../../common/models/state-status";
import { RequestState } from "../../../states/request.state";
import { Request } from "../../../../common/models/request";
import { RequestPosition } from "../../../../common/models/request-position";
import { TechnicalCommercialProposalState } from "../../../states/technical-commercial-proposal.state";
import { filter, finalize, mapTo, publishReplay, refCount, switchMap, takeUntil, tap } from "rxjs/operators";
import { RequestActions } from "../../../actions/request.actions";
import { TechnicalProposalsService } from "../../../services/technical-proposals.service";

@Component({
  selector: 'app-procedure-view',
  templateUrl: './procedure-view.component.html'
})
export class ProcedureViewComponent implements OnDestroy, OnInit {

  @Select(TechnicalCommercialProposalState.availablePositions) technicalCommercialProposalPositions$: Observable<RequestPosition[]>;
  @Select(CommercialProposalState.availablePositions) commercialProposalPositions$: Observable<RequestPosition[]>;
  @Select(RequestState.request) request$: Observable<Request>;
  readonly destroy$ = new Subject();

  @Output() bargain = new EventEmitter();
  @Output() prolong = new EventEmitter();

  requestId: Uuid;
  sourceFromUrl: ProposalSource;
  procedure: Procedure|null;
  procedureId: number;
  positions$: Observable<RequestPosition[]>;
  procedures$: Observable<Procedure[]>;

  procedureModalPayload: ProcedureAction & { procedure?: Procedure };
  prolongModalPayload: Procedure;

  state: StateStatus = "pristine";

  constructor(
    private title: Title,
    private bc: UxgBreadcrumbsService,
    private route: ActivatedRoute,
    protected router: Router,
    private requestService: RequestService,
    private procedureService: ProcedureService,
    private technicalProposalsService: TechnicalProposalsService,
    public store: Store
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.sourceFromUrl = params.source;
      this.procedureId = +params.procedureId;
    });

    let sourceName: string;
    let sourceSegment: string;

    switch (this.sourceFromUrl) {
      case ProposalSource.TECHNICAL_COMMERCIAL_PROPOSAL:
        sourceName = 'Согласование технико-коммерческих предложений';
        sourceSegment = 'technical-commercial-proposals';
        this.positions$ = this.technicalCommercialProposalPositions$;
        break;
      case ProposalSource.COMMERCIAL_PROPOSAL:
        sourceName = 'Согласование коммерческих предложений';
        sourceSegment = 'commercial-proposals';
        this.positions$ = this.commercialProposalPositions$;
        break;
      case ProposalSource.TECHNICAL_PROPOSAL:
        sourceName = 'Согласование технических предложений';
        sourceSegment = 'technical-proposals';
        this.positions$ = this.technicalProposalsService.positions(this.requestId);
        break;
      default:
        return null;
    }

    this.route.params.pipe(
      tap(({id}) => this.requestId = id),
      switchMap(({id}) => this.store.dispatch(new RequestActions.Fetch(id))),
      switchMap(() => this.request$),
      filter(request => !!request),
      tap(({id, number}) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/backoffice" },
        { label: `Заявка №${number}`, link: `/requests/backoffice/${id}` },
        { label: sourceName, link: `/requests/backoffice/${id}/${sourceSegment}` }
      ]),
      tap(() => {
        this.fetchProcedures(this.sourceFromUrl);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  setPageInfo(procedures: Procedure[]) {
    this.procedure = procedures.filter(procedure => procedure.procedureId === this.procedureId)[0];
    this.title.setTitle(`Процедура №${this.procedure.procedureId} «${this.procedure.procedureTitle}»`);
  }

  fetchProcedures(sourceFromUrl): void {
    this.procedureService.list(this.requestId, sourceFromUrl).pipe(
      publishReplay(1), refCount()
    ).subscribe((data) => {
      this.procedures$ = of(data);

      // TODO Совсем некрасивое решение для проверки необходимости смены заголовка страницы; Тёма вернётся, узнаю как лучше это сделать
      if (this.router.routerState.snapshot['_root'].value.queryParams?.procedureId) {
        this.setPageInfo(data);
      }
    });
  }

  refreshProcedures(sourceFromUrl) {
    this.state = "updating";
    this.procedureService.list(this.requestId, sourceFromUrl)
      .pipe(
        finalize(() => this.state = "received"),
        publishReplay(1), refCount()
      ).subscribe((data) => {
      this.procedures$ = of(data);

      // TODO Совсем некрасивое решение для проверки необходимости смены заголовка страницы; Тёма вернётся, узнаю как лучше это сделать
      if (this.router.routerState.snapshot['_root'].value.queryParams?.procedureId) {
        this.setPageInfo(data);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
