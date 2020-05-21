import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { getCurrencySymbol } from "@angular/common";
import { Request } from "../../../common/models/request";

@Component({
  selector: 'app-request-technical-commercial-proposal',
  templateUrl: './technical-commercial-proposal.component.html',
  styleUrls: ['technical-commercial-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalComponent {
  @Input() request: Request;
  @Input() proposal: TechnicalCommercialProposal;
  state: "view" | "edit" = "view";
  folded = false;
  getCurrencySymbol = getCurrencySymbol;

  get publishedCount() {
    return this.proposal?.positions.filter(({status}) => status !== 'NEW').length;
  }

  get isReviewed() {
    return this.proposal?.positions.length > 0 && this.proposal?.positions.every(({status}) => ['APPROVED', 'REJECTED'].includes(status));
  }
}