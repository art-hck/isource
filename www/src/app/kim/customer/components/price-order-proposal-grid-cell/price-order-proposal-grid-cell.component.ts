import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FormControl } from "@angular/forms";
import { getCurrencySymbol } from "@angular/common";
import { KimPriceOrderProposal } from "../../../common/models/kim-price-order-proposal";
import { KimPriceOrderPosition } from "../../../common/models/kim-price-order-position";

@Component({
  selector: 'app-price-order-proposal-grid-cell',
  templateUrl: './price-order-proposal-grid-cell.component.html',
})
export class PriceOrderProposalGridCellComponent {
  @Input() position: KimPriceOrderPosition;
  @Input() proposal: KimPriceOrderProposal;
  @Input() selectedProposal: FormControl;
  @Output() create = new EventEmitter();
  @Output() show = new EventEmitter<KimPriceOrderProposal>();
  @HostBinding('class.grid-item')
  @HostBinding('class.grid-cell')
  @HostBinding('class.app-col') classes = true;
  @HostBinding('class.empty') get isEmpty() { return !this.proposal; }
  getCurrencySymbol = getCurrencySymbol;

}
