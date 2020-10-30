import { Component, Input } from '@angular/core';
import { getCurrencySymbol } from "@angular/common";
import { Request } from "../../../common/models/request";
import { CommercialProposal } from "../../models/commercial-proposal";

@Component({
  selector: 'app-request-commercial-proposal',
  templateUrl: './commercial-proposal.component.html',
  styleUrls: ['./commercial-proposal.component.scss']
})
export class CommercialProposalComponent {
  @Input() request: Request;
  @Input() proposal: CommercialProposal;
  state: "view" | "edit" = "view";
  folded = false;
  getCurrencySymbol = getCurrencySymbol;

  constructor() { }

  get isDraft(): boolean {
    return this.proposal?.items.every(({position}) => ['PROPOSALS_PREPARATION'].includes(position.status));
  }

  get publishedCount() {
    return this.proposal?.items.filter(({position}) => position.status === 'RESULTS_AGREEMENT').length;
  }

  get editable() {
    return this.proposal?.items.every(({position}) => ['NEW', 'SENT_TO_EDIT'].includes(position.status));
  }

  get isReviewed() {
    return this.proposal?.items.length > 0 &&
           this.proposal?.items.every(({position}) => ['WINNER_SELECTED'].includes(position.status));
  }

  get isPartiallyReviewed() {
    return this.proposal?.items.length > 0 &&
           this.proposal?.items.some(({position}) => ['WINNER_SELECTED'].includes(position.status));
  }

  getPositionStatus(position, linkedOffer): string {
    if (position.status === 'PROPOSALS_PREPARATION' && linkedOffer.status === 'DRAFT') {
      return 'DRAFT';
    } else if (position.status === 'NOT_RELEVANT') {
      return 'NOT_RELEVANT';
    } else if (position.status === 'WINNER_SELECTED' && linkedOffer.isWinner) {
      return 'WINNER_SELECTED';
    } else if (linkedOffer.status === 'SENT_TO_EDIT') {
      return 'SENT_TO_EDIT';
    } else if (position.status === 'RESULTS_AGREEMENT' && linkedOffer.status === 'NEW') {
      return 'RESULTS_AGREEMENT';
    }
  }
}
