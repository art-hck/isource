import { ActivatedRoute } from "@angular/router";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Request } from "../../../../../common/models/request";
import { delayWhen, switchMap, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { Uuid } from "../../../../../../cart/models/uuid";
import { UxgBreadcrumbsService } from "uxg";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposalState } from "../../../../states/technical-commercial-proposal.state";
import { TechnicalCommercialProposals } from "../../../../actions/technical-commercial-proposal.actions";
import { StateStatus } from "../../../../../common/models/state-status";
import { ToastActions } from "../../../../../../shared/actions/toast.actions";
import { PluralizePipe } from "../../../../../../shared/pipes/pluralize-pipe";
import { RequestState } from "../../../../states/request.state";
import { RequestActions } from "../../../../actions/request.actions";
import { AppComponent } from "../../../../../../app.component";
import { TechnicalCommercialProposalPositionStatus } from "../../../../../common/enum/technical-commercial-proposal-position-status";
import { ProposalsView } from "../../../../../../shared/models/proposals-view";
import { TechnicalCommercialProposalService } from "../../../../services/technical-commercial-proposal.service";
import { Title } from "@angular/platform-browser";
import { CommonProposal, CommonProposalByPosition } from "../../../../../common/models/common-proposal";
import Reject = TechnicalCommercialProposals.Reject;
import Fetch = TechnicalCommercialProposals.Fetch;
import ReviewMultiple = TechnicalCommercialProposals.ReviewMultiple;
import NEW = TechnicalCommercialProposalPositionStatus.NEW;
import APPROVED = TechnicalCommercialProposalPositionStatus.APPROVED;
import REJECTED = TechnicalCommercialProposalPositionStatus.REJECTED;
import SENT_TO_EDIT = TechnicalCommercialProposalPositionStatus.SENT_TO_EDIT;
import SENT_TO_REVIEW = TechnicalCommercialProposalPositionStatus.SENT_TO_REVIEW;
import SendToEditMultiple = TechnicalCommercialProposals.SendToEditMultiple;

@Component({
  templateUrl: './technical-commercial-proposal-view.component.html',
  providers: [PluralizePipe],
})
export class TechnicalCommercialProposalViewComponent implements OnDestroy, OnInit {

  @Select(RequestState.request) readonly request$: Observable<Request>;
  @Select(TechnicalCommercialProposalState.proposalsByPos([NEW, SENT_TO_REVIEW]))
  readonly proposalsSentToReview$: Observable<CommonProposalByPosition[]>;
  @Select(TechnicalCommercialProposalState.proposalsByPos([APPROVED, REJECTED]))
  readonly proposalsReviewed$: Observable<CommonProposalByPosition[]>;
  @Select(TechnicalCommercialProposalState.proposalsByPos([SENT_TO_EDIT]))
  readonly proposalsSendToEdit$: Observable<CommonProposalByPosition[]>;
  @Select(TechnicalCommercialProposalState.proposals)
  readonly proposals$: Observable<CommonProposal[]>;
  @Select(TechnicalCommercialProposalState.status)
  readonly stateStatus$: Observable<StateStatus>;

  groupId: Uuid;
  view: ProposalsView = "grid";
  readonly destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private store: Store,
    private actions: Actions,
    private pluralize: PluralizePipe,
    private cd: ChangeDetectorRef,
    private app: AppComponent,
    public title: Title,
    public service: TechnicalCommercialProposalService,
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(({ groupId }) => this.groupId = groupId),
      tap(({ id, groupId }) => this.store.dispatch(new Fetch(id, groupId))),
      delayWhen(({ id }) => this.store.dispatch(new RequestActions.Fetch(id))),
      withLatestFrom(this.request$),
      tap(([{ groupId }, { id, number }]) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/customer" },
        { label: `Заявка №${ number }`, link: `/requests/customer/${ id }` },
        { label: 'Согласование ТКП', link: `/requests/customer/${ id }/technical-commercial-proposals` },
        {
          label: 'Страница предложений',
          link: `/requests/customer/${ id }/technical-commercial-proposals/${ groupId }`
        }
      ]),
      switchMap(([{ id, groupId }]) => this.service.getGroupInfo(id, groupId)),
      tap(({ name }) => this.title.setTitle(name)),
      takeUntil(this.destroy$)
    ).subscribe();

    this.actions.pipe(
      ofActionCompleted(SendToEditMultiple, ReviewMultiple),
      takeUntil(this.destroy$)
    ).subscribe(({ result, action }) => {
      const e = result.error as any;
      const length = (action?.proposalPositions?.length ?? 0) + (action?.requestPositions?.length ?? 0) || 1;
      let text = "";
      switch (true) {
        case action instanceof Reject: text = "$1 отклонено"; break;
        case action instanceof SendToEditMultiple: text = "$2 на доработке"; break;
        default: text = "По $0 принято решение";
      }

      text = text.replace(/\$(\d)/g, (all, i) => [
        this.pluralize.transform(length, "позиции", "позициям", "позициям"),
        this.pluralize.transform(length, "предложение", "предложения", "предложений"),
        this.pluralize.transform(length, "позиция", "позиции", "позиций"),
      ][i] || all);

      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) : new ToastActions.Success(text)
      );
    });

    this.switchView(this.view);
  }

  switchView(view: ProposalsView) {
    this.view = view;
    this.app.noHeaderStick = this.app.noContentPadding = view !== "list";
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
