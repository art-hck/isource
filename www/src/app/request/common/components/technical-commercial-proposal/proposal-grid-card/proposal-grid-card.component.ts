import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { TechnicalCommercialProposalPosition } from "../../../models/technical-commercial-proposal-position";
import { getCurrencySymbol } from "@angular/common";
import * as moment from "moment";
import { TechnicalCommercialProposal } from "../../../models/technical-commercial-proposal";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-technical-commercial-proposal-grid-card',
  templateUrl: './proposal-grid-card.component.html',
  styleUrls: ['./proposal-grid-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProposalGridCardComponent {
  @Input() proposal: TechnicalCommercialProposal;
  @Input() proposalPosition: TechnicalCommercialProposalPosition;
  @Input() editable: boolean;
  @Input() selectable: boolean;
  @Output() create = new EventEmitter();
  @Output() click = new EventEmitter();
  @HostBinding('class.grid-item')
  @HostBinding('class.grid-cell')
  @HostBinding('class.app-col') classes = true;
  @HostBinding('class.empty') get isEmpty() { return !this.proposalPosition; }
  getCurrencySymbol = getCurrencySymbol;
  selectedProposalPosition = new FormControl(null, Validators.required);

  isQuantityValid = ({ quantity, position: p }: TechnicalCommercialProposalPosition) => p.quantity === quantity;
  isDateValid = ({ position: p, deliveryDate }: TechnicalCommercialProposalPosition) => p.isDeliveryDateAsap || moment(deliveryDate).isSameOrBefore(moment(p.deliveryDate));
}
