import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { getCurrencySymbol } from "@angular/common";
import { Request } from "../../../common/models/request";
import { Uuid } from "../../../../cart/models/uuid";

@Component({
  selector: 'app-request-technical-commercial-proposal',
  templateUrl: './technical-commercial-proposal.component.html',
  styleUrls: ['technical-commercial-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalComponent {
  @Input() request: Request;
  @Input() groupId: Uuid;
  @Input() proposal: TechnicalCommercialProposal;
  state: "view" | "edit" = "view";
  folded = false;
  getCurrencySymbol = getCurrencySymbol;

  get publishedCount() {
    return this.proposal?.positions.filter(({status}) => status !== 'NEW').length;
  }

  get editable() {
    return this.proposal?.positions.every(({status}) => ['NEW', 'SENT_TO_EDIT'].includes(status));
  }

  get isReviewed() {
    return this.proposal?.positions.length > 0 && this.proposal?.positions.some(({status}) => ['APPROVED'].includes(status));
  }
}
