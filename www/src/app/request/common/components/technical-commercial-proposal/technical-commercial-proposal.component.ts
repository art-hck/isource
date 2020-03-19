import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TechnicalCommercialProposal } from "../../models/technical-commercial-proposal";
import { getCurrencySymbol } from "@angular/common";

@Component({
  selector: 'app-technical-commercial-proposal',
  templateUrl: './technical-commercial-proposal.component.html',
  styleUrls: ['technical-commercial-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalComponent {
  @Input() technicalCommercialProposal: TechnicalCommercialProposal;
  @Output() edit = new EventEmitter();
  folded = false;
  getCurrencySymbol = getCurrencySymbol;
}
