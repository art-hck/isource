import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UxgBreadcrumbsService, UxgTabTitleComponent } from "uxg";
import { Uuid } from "../../../../cart/models/uuid";
import { Actions, Select, Store } from "@ngxs/store";
import { RequestState } from "../../states/request.state";
import { Observable, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { StateStatus } from "../../../common/models/state-status";
import { DOCUMENT, getCurrencySymbol } from "@angular/common";
import { AppComponent } from "../../../../app.component";
import { delayWhen, startWith, switchMap, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { RequestActions } from "../../actions/request.actions";
import { CommercialProposals } from "../../actions/commercial-proposal.actions";
import { CommercialProposalState } from "../../states/commercial-proposal.state";
import { PositionStatus } from "../../../common/enum/position-status";
import { RequestPosition } from "../../../common/models/request-position";
import { SupplierCommercialProposalInfo } from "../../../back-office/models/supplier-commercial-proposal-info";
import { GridFooterComponent } from "../../../../shared/components/grid/grid-footer/grid-footer.component";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { Proposal } from "../../../../shared/components/grid/proposal";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import { GridRowComponent } from "../../../../shared/components/grid/grid-row/grid-row.component";
import { Position } from "../../../../shared/components/grid/position";
import { CommercialProposalListComponent } from "../commercial-proposal-list/commercial-proposal-list.component";
import { ProposalHelperService } from "../../../../shared/components/grid/proposal-helper.service";
import { ProposalsView } from "../../../../shared/models/proposals-view";
import { CommercialProposalsStatus } from "../../../common/enum/commercial-proposals-status";
import { RequestPositionStatusService } from "../../../common/services/request-position-status.service";
import { CommercialProposalReviewBody } from "../../../common/models/commercial-proposal-review-body";
import { GridSupplier } from "../../../../shared/components/grid/grid-supplier";
import { Title } from "@angular/platform-browser";
import { CommercialProposalsService } from "../../services/commercial-proposals.service";
import Fetch = CommercialProposals.Fetch;
import Review = CommercialProposals.Review;

@Component({
  templateUrl: './commercial-proposal-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommercialProposalViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('proposalOnReview') proposalsOnReview: QueryList<GridRowComponent | CommercialProposalListComponent>;
  @ViewChild(GridFooterComponent, { read: ElementRef }) proposalsFooterRef: ElementRef;

  @ViewChild('sentToReviewTab') sentToReviewTabElRef: UxgTabTitleComponent;
  @ViewChild('reviewedTab') reviewedTabElRef: UxgTabTitleComponent;
  @ViewChild('sendToEditTab') sentToEditTabElRef: UxgTabTitleComponent;

  @Select(CommercialProposalState.proposalsByPos(PositionStatus.RESULTS_AGREEMENT))
  readonly positionsOnReview$: Observable<RequestPosition[]>;

  @Select(CommercialProposalState.proposalsByPos(CommercialProposalsStatus.SENT_TO_EDIT))
  readonly positionsSendToEdit$: Observable<RequestPosition[]>;

  @Select(CommercialProposalState.proposalsByPosHasWinner)
  readonly positionsReviewed$: Observable<RequestPosition[]>;

  @Select(CommercialProposalState.positionsLength) readonly positionsLength$: Observable<number>;
  @Select(RequestState.request) readonly request$: Observable<Request>;
  @Select(CommercialProposalState.status) readonly status$: Observable<StateStatus>;
  @Select(CommercialProposalState.suppliers) readonly suppliers$: Observable<SupplierCommercialProposalInfo[]>;
  requestId: Uuid;
  groupId: Uuid;
  view: ProposalsView = "grid";
  gridRows: ElementRef[];
  showedProposal: Proposal<RequestOfferPosition>;
  modalData: { proposal: Proposal<RequestOfferPosition>, position: Position<RequestPosition> };
  readonly destroy$ = new Subject();
  readonly chooseBy$ = new Subject<"date" | "price" | Proposal["sourceProposal"]>();
  readonly getCurrencySymbol = getCurrencySymbol;

  get total(): number {
    return this.proposalsOnReview?.reduce((total, { selectedProposal }) => {
      const proposalPosition: Proposal = selectedProposal.value;
      total += proposalPosition?.priceWithoutVat * proposalPosition?.quantity || 0;
      return total;
    }, 0);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private store: Store,
    private actions: Actions,
    private bc: UxgBreadcrumbsService,
    private cd: ChangeDetectorRef,
    private app: AppComponent,
    private title: Title,
    public helper: ProposalHelperService,
    public statusService: RequestPositionStatusService,
    public service: CommercialProposalsService
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(({ id }) => this.requestId = id),
      tap(({ groupId }) => this.groupId = groupId),
      tap(({ id, groupId }) => this.store.dispatch(new Fetch(id, groupId))),
      delayWhen(({ id }) => this.store.dispatch(new RequestActions.Fetch(id))),
      withLatestFrom(this.request$),
      tap(([{ groupId }, { id, number }]) => this.bc.breadcrumbs = [
        { label: "Заявки", link: "/requests/customer" },
        { label: `Заявка №${ number }`, link: `/requests/customer/${ id }` },
        { label: 'Согласование КП', link: `/requests/customer/${ id }/commercial-proposals` },
        { label: 'Страница предложений', link: `/requests/customer/${ id }/commercial-proposals/${ groupId }` }
      ]),
      switchMap(([{ id, groupId }]) => this.service.group(id, groupId)),
      tap(({ name }) => this.title.setTitle(name)),
      takeUntil(this.destroy$)
    ).subscribe();

    this.switchView(this.view);
  }

  ngAfterViewInit() {
    const footerEl = this.document.querySelector('.app-footer');
    footerEl.parentElement.insertBefore(this.proposalsFooterRef.nativeElement, footerEl);

    this.proposalsOnReview.changes.pipe(
      startWith(this.proposalsOnReview),
      tap(() => this.gridRows = this.proposalsOnReview.reduce((gridRows, c) => [...gridRows, ...c.gridRows], [])),
      tap(() => this.cd.detectChanges()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  switchView(view: ProposalsView): void {
    this.view = view;
    this.app.noContentPadding = view !== "list";
    this.app.noHeaderStick = this.app.noContentPadding = view !== "list";
    this.cd.detectChanges();
  }

  selectProposal(proposal: Proposal): void {
    this.proposalsOnReview
      .filter(({ proposals }) => proposals.some(({id}) => proposal.id === id))
      .forEach(({selectedProposal}) => selectedProposal.setValue(proposal.sourceProposal));
  }

  hasAnalogs(positions: RequestPosition[]) {
    return i => positions.map(({ linkedOffers }) => linkedOffers[i]).some(p => p?.isAnalog);
  }

  hasWinner({ linkedOffers }: RequestPosition) {
    return linkedOffers.some(p => p?.isWinner);
  }

  isSentToEdit(position: RequestPosition): boolean {
    return this.isReviewed(position) && position.linkedOffers.some(({status}) => status === CommercialProposalsStatus.SENT_TO_EDIT);
  }

  isReviewed({ status, linkedOffers }: RequestPosition): boolean {
    // Считаем рассмотренным, если у предложений статус !NEW или позиция после статуса согласования КП (не включая)
    return linkedOffers.every(({ status: s }) => s !== CommercialProposalsStatus.NEW) ||
      this.statusService.isStatusAfter(status, PositionStatus.RESULTS_AGREEMENT);
  }

  reviewSelected() {
    const body = this.proposalsOnReview
      .reduce((_body: CommercialProposalReviewBody, {selectedProposal, sendToEditPosition, position}) => {
        if (selectedProposal.valid) {
          _body.accepted = {..._body.accepted, [position.id]: selectedProposal.value.id};
        }

        if (sendToEditPosition.valid) {
          _body.sendToEdit = [..._body.sendToEdit ?? [], position.id];
        }
        return _body;
      }, {});

    this.store.dispatch(new Review(this.requestId, this.groupId, body));
  }

  sendToEditAll() {
    this.store.dispatch(new Review(this.requestId, this.groupId, { sendToEdit: this.proposalsOnReview.map(({ position }) => position.id)}));
  }

  convertProposals = (proposals: RequestOfferPosition[]) => proposals.map(p => new Proposal(p));
  convertPosition = (position: RequestPosition) => new Position(position);
  convertSuppliers = (suppliers: ContragentShortInfo[], positions: RequestPosition[]): GridSupplier[] => {
    return suppliers.reduce((arr: GridSupplier[], supplier) => {
      [false, true]
        .filter(hasAnalogs => positions.some(({linkedOffers}) => linkedOffers.some(({supplierContragentId: id, isAnalog}) => id === supplier.id && isAnalog === hasAnalogs)))
        .forEach(hasAnalogs => arr.push({ ...supplier, hasAnalogs }));
      return arr;
    }, []);
  }

  getProposalBySupplier = (position: RequestPosition) => ({ id, hasAnalogs }: GridSupplier) => {
    const proposal = position.linkedOffers.find(({ supplierContragentId, isAnalog }) => supplierContragentId === id && isAnalog === hasAnalogs);
    return proposal ? new Proposal<RequestOfferPosition>(proposal) : null;
  }

  getProposalSupplier = (proposal: Proposal<RequestOfferPosition>) => proposal.sourceProposal.supplierContragent;

  switchTab() {
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.proposalsFooterRef.nativeElement.remove();
  }
}
