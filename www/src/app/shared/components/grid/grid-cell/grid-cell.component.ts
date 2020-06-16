import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { FormControl } from "@angular/forms";
import { getCurrencySymbol } from "@angular/common";
import { Position } from "../position";
import { Proposal } from "../proposal";
import { ProposalHelperService } from "../proposal-helper.service";

@Component({
  selector: 'app-grid-cell',
  templateUrl: './grid-cell.component.html',
})
export class GridCellComponent {
  @Input() position: Position;
  @Input() proposal: Proposal;
  @Input() selectedProposal: FormControl;
  @Input() editable: boolean;
  @Output() create = new EventEmitter();
  @Output() show = new EventEmitter<Proposal>();
  @HostBinding('class.grid-item')
  @HostBinding('class.grid-cell')
  @HostBinding('class.app-col') classes = true;
  @HostBinding('class.empty') get isEmpty() { return !this.proposal; }
  getCurrencySymbol = getCurrencySymbol;

  constructor(public helper: ProposalHelperService) {}
}
