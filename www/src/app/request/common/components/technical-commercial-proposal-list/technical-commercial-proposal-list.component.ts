import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TechnicalCommercialProposal } from "../../models/technical-commercial-proposal";

@Component({
  selector: 'app-technical-commercial-proposal-list',
  templateUrl: './technical-commercial-proposal-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalListComponent {
  @Input() technicalCommercialProposals: TechnicalCommercialProposal[];
}
