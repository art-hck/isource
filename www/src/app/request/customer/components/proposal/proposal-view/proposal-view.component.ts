import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Subject } from "rxjs";
import { Request } from "../../../../common/models/request";
import { startWith, takeUntil, tap } from "rxjs/operators";
import { Uuid } from "../../../../../cart/models/uuid";
import { UxgRadioItemComponent, UxgTabTitleComponent } from "uxg";
import { StateStatus } from "../../../../common/models/state-status";
import { ProposalComponent } from "../proposal/proposal.component";
import { DOCUMENT, getCurrencySymbol } from "@angular/common";
import { PluralizePipe } from "../../../../../shared/pipes/pluralize-pipe";
import { GridFooterComponent } from "../../../../../shared/components/grid/grid-footer/grid-footer.component";
import { ProposalsView } from "../../../../../shared/models/proposals-view";
import { GridSupplier } from "../../../../../shared/components/grid/grid-supplier";
import { Proposal } from "../../../../../shared/components/grid/proposal";
import { GridRowComponent } from "../../../../../shared/components/grid/grid-row/grid-row.component";
import { ProposalHelperService } from "../../../../../shared/components/grid/proposal-helper.service";
import { ContragentShortInfo } from "../../../../../contragent/models/contragent-short-info";
import { CommonProposal, CommonProposalByPosition, CommonProposalItem } from "../../../../common/models/common-proposal";
import { RequestPosition } from "../../../../common/models/request-position";
import { ProposalSource } from "../../../../back-office/enum/proposal-source";

@Component({
  selector: 'app-common-proposal-view',
  templateUrl: './proposal-view.component.html',
  providers: [PluralizePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProposalViewComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('sentToReviewTab') sentToReviewTabElRef: UxgTabTitleComponent;
  @ViewChild('sendToEditTab') sendToEditTabElRef: UxgTabTitleComponent;
  @ViewChild('reviewedTab') reviewedTabElRef: UxgTabTitleComponent;
  @ViewChildren('sendToEditRadio') sendToEditRadioElRef: QueryList<UxgRadioItemComponent>;
  @ViewChildren('proposalOnReview') proposalsOnReview: QueryList<ProposalComponent | GridRowComponent>;
  @ViewChild(GridFooterComponent, { read: ElementRef }) proposalsFooterRef: ElementRef;
  @ViewChildren("tcpComponent") tcpComponentList: QueryList<ProposalComponent>;

  @Input() request: Request;
  @Input() positions: RequestPosition[];
  @Input() proposalsByPosSentToReview: CommonProposalByPosition[];
  @Input() proposalsByPosReviewed: CommonProposalByPosition[];
  @Input() proposalsByPosSendToEdit: CommonProposalByPosition[];
  @Input() proposalsSentToReview: CommonProposal[];
  @Input() proposalsReviewed: CommonProposal[];
  @Input() proposalsSendToEdit: CommonProposal[];
  @Input() proposals: CommonProposal[];
  @Input() stateStatus: StateStatus;
  @Input() view: ProposalsView = "grid";
  @Input() groupId: Uuid;
  @Input() source: ProposalSource;

  @Output() viewChange = new EventEmitter<ProposalsView>();
  @Output() review = new EventEmitter<{ accepted?: CommonProposalItem[], sendToEdit?: RequestPosition[] }>();
  @Output() downloadAnalyticalReport = new EventEmitter();

  readonly chooseBy$ = new Subject<"date" | "price">();
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly destroy$ = new Subject();
  stickedPosition: boolean;
  gridRows: ElementRef[];
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
      supplierIndex: number;
      toSendToEdit: Proposal<CommonProposalItem>[];
      toApprove: Proposal<CommonProposalItem>[]
    }[]
  };

  get total() {
    return this.proposalsOnReview?.reduce((total, curr) => {
      const proposalPosition: CommonProposalItem = curr.selectedProposal.value;
      total += proposalPosition?.priceWithoutVat * proposalPosition?.quantity || 0;
      return total;
    }, 0);
  }

  /**
   * Возвращает список выбранных для согласования CommonProposalItem
   */
  get selectedToApproveProposals(): Proposal<CommonProposalItem>[] {
    // Получаем список ID выбранных предложений
    const selectedToApproveProposalsIds = this.proposalsOnReview?.filter(
      ({ selectedProposal }) => selectedProposal.value
    ).map(({ selectedProposal }) => selectedProposal.value.id);

    let selectedToApproveProposals = this.proposalsOnReview?.filter(
      proposal => proposal.selectedProposal.value
    ).map(proposal => {
      return proposal['proposals'] ? (<GridRowComponent>proposal).proposals : (<ProposalComponent>proposal).proposalByPos.items;
    })?.reduce((acc: [], val) => [...acc, ...val], []);

    selectedToApproveProposals = selectedToApproveProposals?.filter(selectedProposal => selectedToApproveProposalsIds.indexOf(selectedProposal.id) !== -1);

    return selectedToApproveProposals as Proposal[];
  }

  /**
   * Возвращает список выбранных для отправки на доработку ТКП
   */
  get selectedToSendToEditProposals(): Proposal<CommonProposalItem>[] {
    const selectedSendToEditProposals = this.proposalsOnReview?.filter((proposal) => proposal.sendToEditPosition.value).map(proposal => {
      return proposal['proposals'] ? (<GridRowComponent>proposal).proposals : (<ProposalComponent>proposal).proposalByPos.items;
    });

    return selectedSendToEditProposals?.reduce((acc: [], val) => [...acc, ...val], []) as Proposal[];
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
  get selectedPositionsBySuppliers(): {
    supplier: ContragentShortInfo;
    supplierIndex: number;
    toSendToEdit: Proposal<CommonProposalItem>[];
    toApprove: Proposal<CommonProposalItem>[]
  }[] {
    // Объединяем все отмеченные предложения (на согласование + на доработку)
    const selectedProposals = this.selectedToApproveProposals.concat(this.selectedToSendToEditProposals);

    // Получаем всех поставщиков из собранных и объединённых предложений
    const flatProposalsSuppliers = selectedProposals.map(({ sourceProposal }) => sourceProposal.supplierContragent);

    // Убираем из массива поставщиков повторяющиеся значения и оставляем только уникальных
    const uniqueProposalsSuppliers = flatProposalsSuppliers.filter((supplier, index, array) =>
      !array.filter((v, i) => JSON.stringify(supplier.id) === JSON.stringify(v.id) && i < index).length);

    // Используем собранный список поставщиков для формирования массива объектов
    const uniqueProposalsSuppliersData = uniqueProposalsSuppliers.map(supplier => {
      const suppliersIds = this.suppliers(this.proposals).map(supplierItem => supplierItem.id);
      const supplierIndexNumber = suppliersIds.indexOf(supplier.id);

      return {
        supplier: supplier,
        supplierIndex: supplierIndexNumber,
        toApprove: this.selectedPositionsBySupplierAndType('to-approve', supplier.id),
        toSendToEdit: this.selectedPositionsBySupplierAndType('to-send-to-edit', supplier.id)
      };
    });

    // Сортируем собранные данные по индексу поставщика
    return uniqueProposalsSuppliersData.sort((a, b) => {
      return a.supplierIndex - b.supplierIndex;
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
    private cd: ChangeDetectorRef,
    public helper: ProposalHelperService,
  ) {}

  ngOnChanges({proposalsSentToReview, proposalsReviewed, proposalsSendToEdit}: SimpleChanges) {
    if (proposalsSentToReview || proposalsReviewed || proposalsSendToEdit) {
      this.cd.detectChanges();
    }
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

    // Для корректного автопереключения таба при загрузке страницы детектим изменения
    this.cd.detectChanges();
  }

  get disabled() {
    return this.proposalsOnReview?.toArray()
      .every(({ selectedProposal, sendToEditPosition }) => selectedProposal.invalid && sendToEditPosition.invalid);
  }

  reviewMultiple() {
    const accepted: CommonProposalItem[] = this.proposalsOnReview
      .filter(({ selectedProposal }) => selectedProposal.valid)
      .map(({ selectedProposal }) => selectedProposal.value);
    const sendToEdit: RequestPosition[] = this.proposalsOnReview
      .filter(({ sendToEditPosition }) => sendToEditPosition.valid)
      .map(({ sendToEditPosition }) => sendToEditPosition.value);

    this.review.emit({ accepted, sendToEdit });
  }

  sendToEditAll() {
    const sendToEdit = this.proposalsOnReview.map(({ position }) => position.sourcePosition);

    this.review.emit({ sendToEdit });
  }

  openConfirmApproveFromListModal() {
    const toApproveCounter = this.selectedToApproveProposals.length;
    const sendToEditCounter = this.proposalsOnReview?.filter(({ sendToEditPosition }) => sendToEditPosition.value).length;

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
  selectedPositionsBySupplierAndType(type, supplierId = null): Proposal<CommonProposalItem>[] {
    const selectedProposals = type === 'to-approve' ? this.selectedToApproveProposals : this.selectedToSendToEditProposals;

    if (!supplierId) {
      return selectedProposals;
    }

    return selectedProposals.filter(({ sourceProposal }) => sourceProposal.supplierContragent.id === supplierId);
  }

  approveFromListView(): void {
    if (this.selectedPositions) {
      const selectedPositions = Array.from(this.selectedPositions, (tcp) => tcp);
      this.review.emit({accepted: selectedPositions});
    }
  }

  sendToEditFromListView(): void {
    if (this.selectedPositions) {
      const selectedPositions = Array.from(this.selectedPositions, (tcp) => tcp.position);
      this.review.emit({sendToEdit: selectedPositions});
    }
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
      .filter((c) => {
        const proposals = c['proposals'] ? (<GridRowComponent>c).proposals : (<ProposalComponent>c).proposalByPos.items;
        return proposals.some((_proposal) => proposal.id === _proposal.id);
      })
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
  trackById = (i, { id }: CommonProposal) => id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.proposalsFooterRef.nativeElement.remove();
  }
}
