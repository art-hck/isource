import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Subject } from "rxjs";
import { getCurrencySymbol } from "@angular/common";
import { TechnicalCommercialProposalPosition } from "../../../../request/common/models/technical-commercial-proposal-position";

@Component({
  selector: 'app-grid-footer',
  templateUrl: './grid-footer.component.html'
})
export class GridFooterComponent {
  @Input() chooseBy$: Subject<"price" | "date">;
  @Input() total: number;
  @Input() selectedProposals;
  @Input() selectedPositions;
  @Input() viewType: string;
  @Input() disabled: boolean;
  @Input() loading: boolean;
  @Input() source: string;
  @Output() approve = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() sendToEdit = new EventEmitter();
  @Output() approveFromListView = new EventEmitter();
  @Output() sendToEditFromListView = new EventEmitter();
  @Output() confirmApproveFromList = new EventEmitter();
  @HostBinding('class.hidden') @Input() hidden: boolean;
  @HostBinding('class.proposals-footer') proposalsFooter = true;
  getCurrencySymbol = getCurrencySymbol;

  getSummaryPriceByPositions(positions: TechnicalCommercialProposalPosition[]): number {
    return positions.map(position => position.priceWithoutVat * position.quantity).reduce((sum, priceWithoutVat) => sum + priceWithoutVat, 0);
  }
}
