import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Request } from "../../../common/models/request";
import { TechnicalProposal } from "../../../common/models/technical-proposal";

@Component({
  selector: 'app-request-backoffice-technical-proposal',
  templateUrl: './request-technical-proposal.component.html'
})
export class RequestTechnicalProposalComponent {
  @Input() request: Request;
  @Input() technicalProposal: TechnicalProposal;
  @Output() update = new EventEmitter<TechnicalProposal>();
  editing: boolean;
}
