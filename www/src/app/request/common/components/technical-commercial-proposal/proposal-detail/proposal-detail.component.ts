import { Component, Input, OnInit } from '@angular/core';
import { TechnicalCommercialProposalPosition } from "../../../models/technical-commercial-proposal-position";
import * as moment from "moment";
import { getCurrencySymbol } from "@angular/common";
import { TechnicalCommercialProposal } from "../../../models/technical-commercial-proposal";

@Component({
  selector: 'app-technical-commercial-proposal-detail',
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['./proposal-detail.component.scss']
})
export class ProposalDetailComponent {

  @Input() proposal: TechnicalCommercialProposal;
  @Input() proposalPosition: TechnicalCommercialProposalPosition;
  getCurrencySymbol = getCurrencySymbol;

  isDateValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return proposalPosition.position.isDeliveryDateAsap ||
      moment(proposalPosition.deliveryDate).isSameOrBefore(moment(proposalPosition.position.deliveryDate));
  }

  isQuantityValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return proposalPosition.quantity === proposalPosition.position.quantity;
  }
}
