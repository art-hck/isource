import { ActivatedRoute } from "@angular/router";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { RequestService } from "../../services/request.service";
import { auditTime, debounceTime, takeUntil, tap, throttleTime } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { FeatureService } from "../../../../core/services/feature.service";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { RequestPosition } from "../../../common/models/request-position";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { NotificationService } from "../../../../shared/services/notification.service";
import Create = TechnicalCommercialProposals.Create;
import Update = TechnicalCommercialProposals.Update;
import Publish = TechnicalCommercialProposals.Publish;

@Component({
  templateUrl: './technical-commercial-proposal-list.component.html',
  styleUrls: ['technical-commercial-proposal-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalListComponent implements OnInit, OnDestroy {
  @Select(TechnicalCommercialProposalState.getList)
  readonly technicalCommercialProposals$: Observable<TechnicalCommercialProposal[]>;
  @Select(TechnicalCommercialProposalState.proposalsLength)
  readonly proposalsLength$: Observable<number>;
  readonly destroy$ = new Subject();
  requestId: Uuid;
  request$: Observable<Request>;
  showForm: boolean;

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private requestService: RequestService,
    private featureService: FeatureService,
    private store: Store,
    private actions: Actions,
    private notificationService: NotificationService,
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
    this.actions.pipe(
      ofActionCompleted(Create, Update, Publish),
      throttleTime(1),
      takeUntil(this.destroy$)
    ).subscribe(({action, result}) => {
      const e = result.error as any;
      this.notificationService.toast(
        e && e.error.detail || (`ТКП успешно ${action instanceof Publish ? 'отправлено' : 'сохранено'}`),
        result.error ? "error" : "success"
      );
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
