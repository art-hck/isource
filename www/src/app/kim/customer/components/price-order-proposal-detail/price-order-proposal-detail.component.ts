import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { getCurrencySymbol } from "@angular/common";
import { KimPriceOrder } from "../../../common/models/kim-price-order";
import { KimPriceOrderProposal } from "../../../common/models/kim-price-order-proposal";
import { ProposalHelperService } from "../../services/proposal-helper.service";
import { KimPriceOrderPosition } from "../../../common/models/kim-price-order-position";
import { Position } from "../../../../shared/components/grid/position";
import { Proposal } from "../../../../shared/components/grid/proposal";

@Component({
  selector: 'app-kim-price-order-proposal-detail',
  templateUrl: './price-order-proposal-detail.component.html',
  styleUrls: ['./price-order-proposal-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceOrderProposalDetailComponent {

  @Input() priceOrder: KimPriceOrder;
  @Input() position: KimPriceOrderPosition;
  @Input() proposal: KimPriceOrderProposal;
  getCurrencySymbol = getCurrencySymbol;

  get positionWithDeliveryDate() {
    return new Position<KimPriceOrderPosition>(this.position, (p) => ({...p, deliveryDate: this.priceOrder?.dateDelivery}));
  }

  get proposalWithDeliveryDate() {
    return new Proposal<KimPriceOrderProposal>(this.proposal, p => ({...p, deliveryDate: p.proposalSupplier.dateDelivery}));
  }

  constructor(public helper: ProposalHelperService) {}
}
