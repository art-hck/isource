import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Subject } from "rxjs";
import { getCurrencySymbol } from "@angular/common";
import { TechnicalCommercialProposalPosition } from "../../../../request/common/models/technical-commercial-proposal-position";
import { ProposalsView } from "../../../models/proposals-view";

@Component({
  selector: 'app-grid-footer',
  templateUrl: './grid-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridFooterComponent {
  @Input() chooseBy$: Subject<"price" | "date">;
  @Input() total: number;
  @Input() selectedProposals: { toApprove, toSendToEdit };
  @Input() selectedPositions;
  @Input() view: ProposalsView;
  @Input() disabled: boolean;
  @Input() loading: boolean;
  @Output() selectAllToSendToEdit = new EventEmitter();
  @Output() approve = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() sendToEdit = new EventEmitter();
  @Output() approveFromListView = new EventEmitter();
  @Output() sendToEditFromListView = new EventEmitter();
  @HostBinding('class.hidden') @Input() hidden: boolean;
  @HostBinding('class.proposals-footer') proposalsFooter = true;
  readonly getCurrencySymbol = getCurrencySymbol;

  getSummaryPriceByPositions(positions: TechnicalCommercialProposalPosition[]): number {
    return positions.map(position => position.priceWithoutVat * position.quantity).reduce((sum, priceWithoutVat) => sum + priceWithoutVat, 0);
  }
}
