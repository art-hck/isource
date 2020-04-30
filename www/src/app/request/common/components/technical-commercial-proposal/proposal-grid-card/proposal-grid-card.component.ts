import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { TechnicalCommercialProposalPosition } from "../../../models/technical-commercial-proposal-position";
import { getCurrencySymbol } from "@angular/common";
import { TechnicalCommercialProposal } from "../../../models/technical-commercial-proposal";
import { TechnicalCommercialProposalHelperService } from "../../../services/technical-commercial-proposal-helper.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-technical-commercial-proposal-grid-card',
  templateUrl: './proposal-grid-card.component.html'
})
export class ProposalGridCardComponent {
  @Input() proposal: TechnicalCommercialProposal;
  @Input() proposalPosition: TechnicalCommercialProposalPosition;
  @Input() editable: boolean;
  @Input() selectedProposalPosition: FormControl;
  @Output() create = new EventEmitter();
  @Output() click = new EventEmitter();
  @HostBinding('class.grid-item')
  @HostBinding('class.grid-cell')
  @HostBinding('class.app-col') classes = true;
  @HostBinding('class.empty') get isEmpty() { return !this.proposalPosition; }
  getCurrencySymbol = getCurrencySymbol;

  constructor(public helper: TechnicalCommercialProposalHelperService) {}
}
