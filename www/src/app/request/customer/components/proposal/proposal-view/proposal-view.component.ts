import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Subject } from "rxjs";
import { Request } from "../../../../common/models/request";
import { finalize, takeUntil, tap } from "rxjs/operators";
import { Uuid } from "../../../../../cart/models/uuid";
import { UxgRadioItemComponent, UxgTabTitleComponent } from "uxg";
import { Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../../actions/technical-commercial-proposal.actions";
import { StateStatus } from "../../../../common/models/state-status";
import { TechnicalCommercialProposalComponent } from "../technical-commercial-proposal/technical-commercial-proposal.component";
import { TechnicalCommercialProposalPosition } from "../../../../common/models/technical-commercial-proposal-position";
import { DOCUMENT, getCurrencySymbol } from "@angular/common";
import { PluralizePipe } from "../../../../../shared/pipes/pluralize-pipe";
import { TechnicalCommercialProposal } from "../../../../common/models/technical-commercial-proposal";
import { GridFooterComponent } from "../../../../../shared/components/grid/grid-footer/grid-footer.component";
import { ProposalsView } from "../../../../../shared/models/proposals-view";
import { GridSupplier } from "../../../../../shared/components/grid/grid-supplier";
import { Proposal } from "../../../../../shared/components/grid/proposal";
import { GridRowComponent } from "../../../../../shared/components/grid/grid-row/grid-row.component";
import { ProposalHelperService } from "../../../../../shared/components/grid/proposal-helper.service";
import { ContragentShortInfo } from "../../../../../contragent/models/contragent-short-info";
import { CommonProposal, CommonProposalByPosition, CommonProposalItem } from "../../../../common/models/common-proposal";
import { RequestPosition } from "../../../../common/models/request-position";
import ReviewMultiple = TechnicalCommercialProposals.ReviewMultiple;
import SendToEditMultiple = TechnicalCommercialProposals.SendToEditMultiple;

@Component({
  selector: 'app-common-proposal-view',
  templateUrl: './proposal-view.component.html',
  providers: [PluralizePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProposalViewComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('sentToReviewTab') sentToReviewTabElRef: UxgTabTitleComponent;
  @ViewChild('sendToEditTab') sendToEditTabElRef: UxgTabTitleComponent;
  @ViewChild('reviewedTab') reviewedTabElRef: UxgTabTitleComponent;
  @ViewChildren('sendToEditRadio') sendToEditRadioElRef: QueryList<UxgRadioItemComponent>;
  @ViewChildren('proposalOnReview') proposalsOnReview: QueryList<TechnicalCommercialProposalComponent | GridRowComponent>;
  @ViewChild(GridFooterComponent, { read: ElementRef }) proposalsFooterRef: ElementRef;
  @ViewChildren("tcpComponent") tcpComponentList: QueryList<TechnicalCommercialProposalComponent>;

  @Input() request: Request;
  @Input() proposalsSentToReview: CommonProposalByPosition[];
  @Input() proposalsReviewed: CommonProposalByPosition[];
  @Input() proposalsSendToEdit: CommonProposalByPosition[];
  @Input() proposals: CommonProposal[];
  @Input() stateStatus: StateStatus;
  @Input() view: ProposalsView = "grid";
  @Input() groupId: Uuid;

  @Output() viewChange = new EventEmitter<ProposalsView>();

  readonly chooseBy$ = new Subject<"date" | "price">();
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly destroy$ = new Subject();
  isLoading: boolean;
  stickedPosition: boolean;
  gridRows: ElementRef[];
  disabled: boolean;
  modalData: {
    proposalItem: Proposal<CommonProposalItem>,
    supplier: ContragentShortInfo,
    position: RequestPosition
  };
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


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
    private cd: ChangeDetectorRef,
    public helper: ProposalHelperService,
  ) {}

  ngOnChanges({ proposalsOnReview }: SimpleChanges) {
    if (proposalsOnReview) {
      // this.disabled = this.proposalsOnReview?.toArray()
      //   .every(({ selectedProposal, sendToEditPosition }) => selectedProposal.invalid && sendToEditPosition.invalid);
      // this.cd.detectChanges();
    }
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
      finalize(() => this.isLoading = false),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  isReviewed(proposalByPos: CommonProposalByPosition): boolean {
    return proposalByPos.items.some(({ status }) => ['APPROVED', 'REJECTED', 'SENT_TO_EDIT'].includes(status));
  }

  hasWinner(proposalByPos: CommonProposalByPosition): boolean {
    return proposalByPos.items.some(({ status }) => ['APPROVED'].includes(status));
  }

  isSentToEdit(proposalByPos: CommonProposalByPosition): boolean {
    return proposalByPos.items.some(({ status }) => ['SENT_TO_EDIT'].includes(status)) && proposalByPos.items.length > 0;
  }

  selectProposal(proposal: Proposal): void {
    this.proposalsOnReview
      .filter(({ proposals }) => proposals.some((_proposal) => proposal.id === _proposal.id))
      .forEach(({ selectedProposal }) => selectedProposal.setValue(proposal.sourceProposal));
  }

  selectSupplierProposal(technicalCommercialProposal: CommonProposal): void {
    technicalCommercialProposal.items.forEach(proposal => this.selectProposal(new Proposal(proposal)));
  }

  suppliers(proposals: CommonProposal[]): GridSupplier[] {
    return proposals.reduce((suppliers: GridSupplier[], proposal) => {
      [false, true]
        .filter(hasAnalogs => proposal.items.some(({ isAnalog }) => isAnalog === hasAnalogs))
        .forEach(hasAnalogs => suppliers.push({ ...proposal.supplier, hasAnalogs }));
      return suppliers;
    }, []);
  }

  getProposalBySupplier = (positionProposals: CommonProposalByPosition) => ({ id, hasAnalogs }: GridSupplier) => {
    const item = positionProposals.items.find(({ supplierContragent, isAnalog }) => supplierContragent.id === id && isAnalog === hasAnalogs);
    return item ? new Proposal<CommonProposalItem>(item) : null;
  }

  getSupplierByProposal = (positionProposals: CommonProposalByPosition, proposal: Proposal<CommonProposalItem>) => {
    return positionProposals.items.find(({ id }) => id === proposal.id).supplierContragent;
  }

  onPositionSelected(data): void {
    this.tcpComponentList.forEach((tcpComponent) => {
      tcpComponent.refreshPositionsSelectedState(data.index, data.selectedPositions);
    });
  }

  getProposal = (positionProposal: CommonProposalByPosition, proposal: Proposal<CommonProposalItem>) => {
    return positionProposal.items.find(({ id }) => id === proposal.id);
  }

  converProposalPosition = ({ items }: CommonProposalByPosition) => items.map((item) => new Proposal(item));
  trackById = (i, { position }: CommonProposalByPosition) => position.id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.proposalsFooterRef.nativeElement.remove();
  }
}
