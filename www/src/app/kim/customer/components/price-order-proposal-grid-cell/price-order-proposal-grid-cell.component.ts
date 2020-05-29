import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FormControl } from "@angular/forms";
import { getCurrencySymbol } from "@angular/common";
import { KimPriceOrderProposalPosition } from "../../../common/models/kim-price-order-proposal-position";

@Component({
  selector: 'app-price-order-proposal-grid-cell',
  templateUrl: './price-order-proposal-grid-cell.component.html',
})
export class PriceOrderProposalGridCellComponent {
  @Input() proposalPosition: KimPriceOrderProposalPosition;
  @Input() selectedProposalPosition: FormControl;
  @Output() create = new EventEmitter();
  @Output() clickOnProposalPosition = new EventEmitter<KimPriceOrderProposalPosition>();
  @HostBinding('class.grid-item')
  @HostBinding('class.grid-cell')
  @HostBinding('class.app-col') classes = true;
  @HostBinding('class.empty') get isEmpty() { return !this.proposalPosition; }
  getCurrencySymbol = getCurrencySymbol;

}
