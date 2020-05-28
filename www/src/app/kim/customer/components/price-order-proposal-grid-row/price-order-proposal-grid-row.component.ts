import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Subject } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { KimPriceOrderProposal } from "../../../common/models/kim-price-order-proposal";

@Component({
  selector: 'app-price-order-proposal-grid-row',
  templateUrl: './price-order-proposal-grid-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceOrderProposalGridRowComponent implements OnInit {
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @Input() suppliers: ContragentShortInfo[];
  @Input() proposals: KimPriceOrderProposal[];
  @Input() priceOrderId: Uuid;
  @Input() chooseBy$: Subject<"date" | "price">;
  @Input() view: "list" | "grid";
  @Output() show = new EventEmitter<KimPriceOrderProposal>();
  readonly selectedProposal = new FormControl(null, Validators.required);
  readonly rejectedProposalPosition = new FormControl(null, Validators.required);

  ngOnInit() {
    this.selectedProposal.valueChanges
      .subscribe(() => this.rejectedProposalPosition.reset(null, {emitEvent: false}));

    this.rejectedProposalPosition.valueChanges
      .subscribe(() => this.selectedProposal.reset(null, {emitEvent: false}));
  }

  get isReviewed(): boolean {
    return this.proposals.some(({ isWinner }) => isWinner);
  }

  getProposal({id}: ContragentShortInfo): KimPriceOrderProposal {
    return this.proposals.find(({ proposalSupplier: { supplier } }) => supplier.id === id);
  }

  trackByProposalPositionId = (i, supplier: ContragentShortInfo) => this.getProposal(supplier)?.id;
}
