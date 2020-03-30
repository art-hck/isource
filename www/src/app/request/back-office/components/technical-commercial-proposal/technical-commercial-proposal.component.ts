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
  @Input() technicalCommercialProposal: TechnicalCommercialProposal;
  state: "view" | "edit" = "view";
  folded = false;
  getCurrencySymbol = getCurrencySymbol;

  get isReviewed(): boolean {
    return this.technicalCommercialProposal && this.technicalCommercialProposal.positions.some(({ status }) => status !== "NEW");
  }
}
