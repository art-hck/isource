import { ActivatedRoute } from "@angular/router";
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, pipe, Subject } from "rxjs";
import { Request } from "../../../common/models/request";
import { delayWhen, finalize, switchMap, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import { Uuid } from "../../../../cart/models/uuid";
import { UxgBreadcrumbsService, UxgRadioItemComponent, UxgTabTitleComponent } from "uxg";
import { Actions, ofActionCompleted, Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { StateStatus } from "../../../common/models/state-status";
import { TechnicalCommercialProposalByPosition } from "../../../common/models/technical-commercial-proposal-by-position";
import { TechnicalCommercialProposalComponent } from "../technical-commercial-proposal/technical-commercial-proposal.component";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { DOCUMENT, getCurrencySymbol } from "@angular/common";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { PluralizePipe } from "../../../../shared/pipes/pluralize-pipe";
import { RequestState } from "../../states/request.state";
import { RequestActions } from "../../actions/request.actions";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { AppComponent } from "../../../../app.component";
import { GridFooterComponent } from "../../../../shared/components/grid/grid-footer/grid-footer.component";
import { TechnicalCommercialProposalPositionStatus } from "../../../common/enum/technical-commercial-proposal-position-status";
import { ProposalsView } from "../../../../shared/models/proposals-view";
import { GridSupplier } from "../../../../shared/components/grid/grid-supplier";
import { Proposal } from "../../../../shared/components/grid/proposal";
import { GridRowComponent } from "../../../../shared/components/grid/grid-row/grid-row.component";
import { ProposalHelperService } from "../../../../shared/components/grid/proposal-helper.service";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { Procedure } from "../../../back-office/models/procedure";
import { TechnicalCommercialProposalService } from "../../services/technical-commercial-proposal.service";
import { Title } from "@angular/platform-browser";
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
  templateUrl: './technical-commercial-proposal-list.component.html',
  providers: [PluralizePipe],
})
export class TechnicalCommercialProposalListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sentToReviewTab') sentToReviewTabElRef: UxgTabTitleComponent;
  @ViewChild('sendToEditTab') sendToEditTabElRef: UxgTabTitleComponent;
  @ViewChild('reviewedTab') reviewedTabElRef: UxgTabTitleComponent;
  @ViewChildren('sendToEditRadio') sendToEditRadioElRef: QueryList<UxgRadioItemComponent>;
  @ViewChildren('proposalOnReview') proposalsOnReview: QueryList<TechnicalCommercialProposalComponent | GridRowComponent>;
  @ViewChild(GridFooterComponent, { read: ElementRef }) proposalsFooterRef: ElementRef;
  @ViewChildren("tcpComponent") tcpComponentList: QueryList<TechnicalCommercialProposalComponent>;

  @Select(RequestState.request)
  readonly request$: Observable<Request>;

  @Select(TechnicalCommercialProposalState.proposalsByPos([NEW, SENT_TO_REVIEW]))
  readonly proposalsSentToReview$: Observable<TechnicalCommercialProposalByPosition[]>;

  @Select(TechnicalCommercialProposalState.proposalsByPos([APPROVED, REJECTED]))
  readonly proposalsReviewed$: Observable<TechnicalCommercialProposalByPosition[]>;

  @Select(TechnicalCommercialProposalState.proposalsByPos([SENT_TO_EDIT]))
  readonly proposalsSendToEdit$: Observable<TechnicalCommercialProposalByPosition[]>;

  @Select(TechnicalCommercialProposalState.proposals)
  readonly proposals$: Observable<TechnicalCommercialProposal[]>;

  @Select(TechnicalCommercialProposalState.status)
  readonly stateStatus$: Observable<StateStatus>;

  reviewedProposals: TechnicalCommercialProposal[] = [];
  sentToReviewProposals: TechnicalCommercialProposal[] = [];
  sentToEditProposals: TechnicalCommercialProposal[] = [];

  readonly chooseBy$ = new Subject<"date" | "price">();
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly destroy$ = new Subject();
  isLoading: boolean;
  stickedPosition: boolean;
  requestId: Uuid;
  groupId: Uuid;
  gridRows: ElementRef[];
  view: ProposalsView = "grid";
  modalData: { proposal: Proposal<TechnicalCommercialProposalPosition>, supplier: ContragentShortInfo, proposalByPosition: TechnicalCommercialProposalByPosition["data"][number] };
  approvalModalData: {
    counters: {
      totalCounter: number,
      toApproveCounter: number,
      sendToEditCounter: number,
    },
    selectedProposals: {
      supplier: ContragentShortInfo;
      toSendToEdit: (TechnicalCommercialProposal | Proposal)[];
      toApprove: (TechnicalCommercialProposal | Proposal)[]
    }[]
  };

  get total() {
    return this.proposalsOnReview?.reduce((total, curr) => {
      const proposalPosition: TechnicalCommercialProposalPosition = curr.selectedProposal.value;
      total += proposalPosition?.priceWithoutVat * proposalPosition?.quantity || 0;
      return total;
    }, 0);
  }

  /**
   * Возвращает список выбранных для согласования ТКП
   */
  get selectedToApproveProposals(): (TechnicalCommercialProposal | Proposal)[] {
    // Получаем список ID выбранных предложений
    const selectedToApproveProposalsIds = this.proposalsOnReview?.filter(
      proposal => proposal.selectedProposal.value
    ).map(proposal => proposal.selectedProposal.value.id);

    let selectedToApproveProposals = this.proposalsOnReview?.filter(
      proposal => proposal.selectedProposal.value
    ).map(proposal => proposal.proposals)?.reduce((acc: [], val) => [...acc, ...val], []);

    selectedToApproveProposals = selectedToApproveProposals?.filter(selectedProposal => selectedToApproveProposalsIds.indexOf(selectedProposal.id) !== -1);

    return selectedToApproveProposals;
  }

  /**
   * Возвращает список выбранных для отправки на доработку ТКП
   */
  get selectedToSendToEditProposals(): (TechnicalCommercialProposal | Proposal)[] {
    const selectedSendToEditProposals = this.proposalsOnReview?.filter((proposal) => proposal.sendToEditPosition.value).map(proposal => proposal.proposals);

    return selectedSendToEditProposals?.reduce((acc: [], val) => [...acc, ...val], []);
  }


  get allSelectedProposals(): { toApprove, toSendToEdit } {
    // Объединяем все отмеченные предложения (на согласование + на доработку)

    return {
      toApprove: this.selectedPositionsBySupplierAndType('to-approve'),
      toSendToEdit: this.selectedPositionsBySupplierAndType('to-send-to-edit')
    };
  }

  /**
   * Возвращает сгруппированный объект, состоящий из Поставщика
   * и отмеченных его предложений на согласование и отправку на доработку
   */
  get selectedPositionsBySuppliers(): { toSendToEdit: (TechnicalCommercialProposal | Proposal)[]; supplier: ContragentShortInfo; toApprove: (TechnicalCommercialProposal | Proposal)[] }[] {
    // Объединяем все отмеченные предложения (на согласование + на доработку)
    const selectedProposals = this.selectedToApproveProposals.concat(this.selectedToSendToEditProposals);

    // Получаем всех поставщиков из собранных и объединённых предложений
    const flatProposalsSuppliers = selectedProposals.map(({ supplier }) => supplier);

    // Убираем из массива поставщиков повторяющиеся значения и оставляем только уникальных
    const uniqueProposalsSuppliers = flatProposalsSuppliers.filter((supplier, index, array) =>
      !array.filter((v, i) => JSON.stringify(supplier.id) === JSON.stringify(v.id) && i < index).length);

    // Используем собранный список поставщиков для формирования массива объектов
    return uniqueProposalsSuppliers.map(supplier => {
      return {
        supplier: supplier,
        toApprove: this.selectedPositionsBySupplierAndType('to-approve', supplier.id),
        toSendToEdit: this.selectedPositionsBySupplierAndType('to-send-to-edit', supplier.id)
      };
    });
  }

  get selectedPositions() {
    const checkedPositions = [];

    this.tcpComponentList?.forEach((tcpComponent) => {
      checkedPositions.push(...tcpComponent.selectedPositions);
    });

    return checkedPositions;
  }

  get disabled() {
    return this.proposalsOnReview?.toArray()
      .every(({ selectedProposal, sendToEditPosition }) => selectedProposal.invalid && sendToEditPosition.invalid);
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private route: ActivatedRoute,
    private bc: UxgBreadcrumbsService,
    private store: Store,
    private actions: Actions,
    private pluralize: PluralizePipe,
    private cd: ChangeDetectorRef,
    private app: AppComponent,
    public helper: ProposalHelperService,
    public title: Title,
    public service: TechnicalCommercialProposalService,
  ) {
  }

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
      ofActionCompleted(Reject, SendToEditMultiple, ReviewMultiple),
      takeUntil(this.destroy$)
    ).subscribe(({ result, action }) => {
      const e = result.error as any;
      const length = (action?.proposalPositions?.length ?? 0) + (action?.requestPositions?.length ?? 0) || 1;
      let text = "";
      switch (true) {
        case action instanceof Reject:
          text = "$1 отклонено";
          break;
        case action instanceof SendToEditMultiple:
          text = "$2 на доработке";
          break;
        default:
          text = "По $0 принято решение";
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

    this.getSentToReviewProposals();
    this.getSentToEditProposals();
    this.getReviewedProposals();

    this.switchView(this.view);
  }

  ngAfterViewInit() {
    const footerEl = this.document.querySelector('.app-footer');
    footerEl.parentElement.insertBefore(this.proposalsFooterRef.nativeElement, footerEl);

    this.proposalsOnReview.changes.pipe(
      tap(() => this.gridRows = this.proposalsOnReview.reduce((gridRows, c) => [...gridRows, ...c.gridRows], [])),
      tap(() => this.cd.detectChanges()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  reviewMultiple() {
    const acceptedProposalPositions = [];
    const sendToEditRequestPositions = [];

    if (this.proposalsOnReview.filter(({ selectedProposal }) => selectedProposal.valid).length) {
      this.proposalsOnReview
        .filter(({ selectedProposal }) => selectedProposal.valid)
        .map(({ selectedProposal }) => {
          acceptedProposalPositions.push(selectedProposal.value);
        });
    }

    if (this.proposalsOnReview.filter(({ sendToEditPosition }) => sendToEditPosition.valid).length) {
      this.proposalsOnReview
        .filter(({ sendToEditPosition }) => sendToEditPosition.valid)
        .map(({ sendToEditPosition }) => {
          sendToEditRequestPositions.push(sendToEditPosition.value);
        });
    }

    this.store.dispatch(new ReviewMultiple(acceptedProposalPositions, sendToEditRequestPositions));
  }

  sendToEditAll() {
    const sendToEditAllPositions = [];

    this.proposalsOnReview.map(({ position }) => {
      sendToEditAllPositions.push(position);
    });

    this.store.dispatch(new SendToEditMultiple(sendToEditAllPositions));
  }

  openConfirmApproveFromListModal() {
    const toApproveCounter = this.selectedToApproveProposals.length;
    const sendToEditCounter = this.selectedToSendToEditProposals.length;

    this.approvalModalData = {
      counters: {
        totalCounter: toApproveCounter + sendToEditCounter,
        toApproveCounter: toApproveCounter,
        sendToEditCounter: sendToEditCounter,
      },
      selectedProposals: this.selectedPositionsBySuppliers
    };
  }

  /**
   * Выбирает все позиции на отправку на доработку
   */
  selectAllPositionsToSendToEdit(): void {
    this.sendToEditRadioElRef.forEach((sendToEditRadio: UxgRadioItemComponent) => {
      return sendToEditRadio.el.nativeElement.click();
    });
  }

  /**
   * Возвращает выбранные предложения для указанного поставщика, и по указанному типу (принятие/на доработку)
   */
  selectedPositionsBySupplierAndType(type, supplierId = null): (TechnicalCommercialProposal | Proposal)[] {
    const selectedProposals = type === 'to-approve' ? this.selectedToApproveProposals : this.selectedToSendToEditProposals;

    if (!supplierId) {
      return selectedProposals;
    }

    return selectedProposals.filter(({ supplier }) => supplier.id === supplierId);
  }

  approveFromListView(): void {
    if (this.selectedPositions) {
      const selectedPositions = Array.from(this.selectedPositions, (tcp) => tcp);
      this.dispatchAction(new ReviewMultiple(selectedPositions, []));
    }
  }

  sendToEditFromListView(): void {
    if (this.selectedPositions) {
      const selectedPositions = Array.from(this.selectedPositions, (tcp) => tcp.position);
      this.dispatchAction(new SendToEditMultiple(selectedPositions));
    }
  }

  private dispatchAction(action): void {
    this.isLoading = true;

    this.store.dispatch(action).pipe(
      finalize(() => {
        this.isLoading = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  switchView(view: ProposalsView) {
    this.view = view;
    this.app.noHeaderStick = this.app.noContentPadding = view !== "list";
    this.cd.detectChanges();
  }

  isReviewed(proposalByPos: TechnicalCommercialProposalByPosition): boolean {
    return proposalByPos.data.some(({ proposalPosition: p }) => ['APPROVED', 'REJECTED', 'SENT_TO_EDIT'].includes(p.status));
  }

  hasWinner(proposalByPos: TechnicalCommercialProposalByPosition): boolean {
    return proposalByPos.data.some(({ proposalPosition: p }) => ['APPROVED'].includes(p.status));
  }

  isSentToEdit(proposalByPos: TechnicalCommercialProposalByPosition): boolean {
    return proposalByPos.data.some(({ proposalPosition: p }) => ['SENT_TO_EDIT'].includes(p.status)) && proposalByPos.data.length > 0;
  }

  selectProposal(proposal: Proposal): void {
    this.proposalsOnReview
      .filter(({ proposals }) => proposals.some((_proposal) => proposal.id === _proposal.id))
      .forEach(({ selectedProposal }) => selectedProposal.setValue(proposal.sourceProposal));
  }

  selectSupplierProposal(technicalCommercialProposal: TechnicalCommercialProposal): void {
    technicalCommercialProposal.positions.forEach(proposal => this.selectProposal(new Proposal(proposal)));
  }

  suppliers(proposals: TechnicalCommercialProposal[]): GridSupplier[] {
    return proposals.reduce((suppliers: GridSupplier[], proposal) => {
      [false, true]
        .filter(hasAnalogs => proposal.positions.some(({ isAnalog }) => isAnalog === hasAnalogs))
        .forEach(hasAnalogs => suppliers.push({ ...proposal.supplier, hasAnalogs }));
      return suppliers;
    }, []);
  }

  getProposalBySupplier = (positionProposals: TechnicalCommercialProposalByPosition) => ({ id, hasAnalogs }: GridSupplier) => {
    const proposal = positionProposals.data.find(({ proposal: { supplier }, proposalPosition }) => supplier.id === id && proposalPosition.isAnalog === hasAnalogs)?.proposalPosition;
    return proposal ? new Proposal<TechnicalCommercialProposalPosition>(proposal) : null;
  }

  getSupplierByProposal = (positionProposals: TechnicalCommercialProposalByPosition, proposal: Proposal<TechnicalCommercialProposalPosition>) => {
    return positionProposals.data.find(({ proposalPosition: { id } }) => id === proposal.id).proposal.supplier;
  }

  onPositionSelected(data): void {
    this.tcpComponentList.forEach((tcpComponent) => {
      tcpComponent.refreshPositionsSelectedState(data.index, data.selectedPositions);
    });
  }

  getSentToReviewProposals(): void {
    this.proposals$.subscribe(pipe((proposals: TechnicalCommercialProposal[]) => {
      this.sentToReviewProposals = proposals?.filter(proposal => proposal.positions.some(position => ['NEW', 'SENT_TO_REVIEW'].includes(position.status)));
    }));
  }

  getSentToEditProposals(): void {
    this.proposals$.subscribe(pipe((proposals: TechnicalCommercialProposal[]) => {
      this.sentToEditProposals = proposals?.filter(proposal => proposal.positions.some(position => position.status === 'SENT_TO_EDIT'));
    }));
  }

  getReviewedProposals(): void {
    this.proposals$.subscribe(pipe((proposals: TechnicalCommercialProposal[]) => {
      this.reviewedProposals = proposals?.filter(proposal => proposal.positions.some(position => ['APPROVED', 'REJECTED'].includes(position.status)));
    }));
  }

  getProposal = (positionProposal: TechnicalCommercialProposalByPosition, proposal: Proposal<TechnicalCommercialProposalPosition>) => {
    return positionProposal.data.find(({ proposalPosition: { id } }) => id === proposal.id);
  }

  converProposalPosition = ({ data }: TechnicalCommercialProposalByPosition) => data.map(({ proposalPosition }) => new Proposal(proposalPosition));
  trackById = (i, { id }: TechnicalCommercialProposal | Procedure) => id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.proposalsFooterRef.nativeElement.remove();
  }
}
