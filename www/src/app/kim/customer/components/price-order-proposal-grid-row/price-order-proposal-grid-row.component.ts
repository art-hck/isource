import { ChangeDetectionStrategy, Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Subject } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { KimPriceOrderProposalPosition } from "../../../common/models/kim-price-order-proposal-position";

@Component({
  selector: 'app-price-order-proposal-grid-row',
  templateUrl: './price-order-proposal-grid-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceOrderProposalGridRowComponent {
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @Input() suppliers: ContragentShortInfo[];
  @Input() proposalPositions: KimPriceOrderProposalPosition[];
  @Input() priceOrderId: Uuid;
  @Input() chooseBy$: Subject<"date" | "price">;
  @Input() view: "list" | "grid";
  readonly selectedProposalPosition = new FormControl(null, Validators.required);

  get isReviewed(): boolean {
    return this.proposalPositions.some(({ isWinner }) => isWinner);
  }

  getProposalPosition(supplier: ContragentShortInfo): KimPriceOrderProposalPosition {
    return this.proposalPositions.find(({ supplier: {id} }) => id === supplier.id);
  }

  trackByProposalPositionId = (i, supplier: ContragentShortInfo) => this.getProposalPosition(supplier)?.id;
}
