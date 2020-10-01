import { ChangeDetectorRef, Component, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { getCurrencySymbol } from "@angular/common";
import { ContragentShortInfo } from "../../../../../contragent/models/contragent-short-info";
import { TechnicalCommercialProposal } from "../../../../common/models/technical-commercial-proposal";
import { Proposal } from "../../../../../shared/components/grid/proposal";
import { TechnicalCommercialProposalComponent } from "../../technical-commercial-proposal/technical-commercial-proposal.component";
import { GridRowComponent } from "../../../../../shared/components/grid/grid-row/grid-row.component";
import { Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../../actions/technical-commercial-proposal.actions";
import { Uuid } from "../../../../../cart/models/uuid";
import DownloadAnalyticalReport = TechnicalCommercialProposals.DownloadAnalyticalReport;

@Component({
  selector: 'app-technical-commercial-proposal-approval-modal',
  templateUrl: './technical-commercial-proposal-approval-modal.component.html',
  styleUrls: ['./technical-commercial-proposal-approval-modal.component.scss']
})
export class TechnicalCommercialProposalApprovalModalComponent {
  filterQuery: string;
  readonly getCurrencySymbol = getCurrencySymbol;
  readonly downloadAnalyticalReport = () => new DownloadAnalyticalReport(this.requestId, this.groupId);

  @Input() isLoading: boolean;
  @Input() requestId: Uuid;
  @Input() groupId: Uuid;
  @Input() proposalsOnReview: QueryList<TechnicalCommercialProposalComponent | GridRowComponent>;
  @Input() approvalModalData: {
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

  @Output() close = new EventEmitter();
  @Output() reviewMultiple = new EventEmitter();

  constructor(
    public store: Store,
  ) {
  }

  /**
   * Сумма выбранных предложений по поставщику
   */
  getSelectedProposalsSumBySupplier(proposals): number {
    return proposals.reduce((sum, proposal) => sum += (proposal?.priceWithoutVat ?? 0), 0);
  }

  /**
   * Сумма всех выбранных предложений по всем поставщикам
   */
  getSelectedProposalsTotalSum(proposals): number {
    const selectedToApprove = proposals.map(proposal => proposal.toApprove);
    const propsFlat = selectedToApprove.reduce((acc: [], val) => [...acc, ...val], []);

    return propsFlat.reduce((sum, p) => sum += (p.priceWithoutVat ?? 0), 0);
  }

  /**
   * Возвращает true, если позиция отфильтрована из списка
   */
  positionIsFiltered(proposalPosition): boolean {
    if (!this.filterQuery?.trim().length) {
      return false;
    }

    return proposalPosition.manufacturingName.toLowerCase().indexOf(this.filterQuery?.toLowerCase()) === -1;
  }

  /**
   * Возвращает true, если все позиции поставщика отфильтрованы из списка
   */
  allPositionsFiltered(proposalPositionsBlock): boolean {
    if (!this.filterQuery?.trim().length) {
      return false;
    }

    return proposalPositionsBlock.toApprove.every(proposal => proposal.manufacturingName.toLowerCase().indexOf(this.filterQuery?.toLowerCase()) === -1) &&
      proposalPositionsBlock.toSendToEdit.every(proposal => proposal.manufacturingName.toLowerCase().indexOf(this.filterQuery?.toLowerCase()) === -1);
  }
}
