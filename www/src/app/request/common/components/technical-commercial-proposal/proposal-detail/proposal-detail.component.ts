import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TechnicalCommercialProposalPosition } from "../../../models/technical-commercial-proposal-position";
import { getCurrencySymbol } from "@angular/common";
import { TechnicalCommercialProposal } from "../../../models/technical-commercial-proposal";
import { TechnicalCommercialProposalHelperService } from "../../../services/technical-commercial-proposal-helper.service";

@Component({
  selector: 'app-technical-commercial-proposal-detail',
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['./proposal-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProposalDetailComponent {

  @Input() proposal: TechnicalCommercialProposal;
  @Input() proposalPosition: TechnicalCommercialProposalPosition;
  getCurrencySymbol = getCurrencySymbol;

  constructor(public helper: TechnicalCommercialProposalHelperService) {}
}
