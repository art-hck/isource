import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Subject } from "rxjs";
import { FormControl, Validators } from "@angular/forms";
import { ContragentShortInfo } from "../../../../contragent/models/contragent-short-info";
import { KimPriceOrderProposal } from "../../../common/models/kim-price-order-proposal";
import { takeUntil, tap } from "rxjs/operators";
import { ProposalHelperService } from "../../services/proposal-helper.service";
import { KimPriceOrderPosition } from "../../../common/models/kim-price-order-position";
import { KimPriceOrder } from "../../../common/models/kim-price-order";
import { Proposal } from "../../../../shared/components/grid/proposal";
import { Position } from "../../../../shared/components/grid/position";

@Component({
  selector: 'app-price-order-proposal-grid-row',
  templateUrl: './price-order-proposal-grid-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceOrderProposalGridRowComponent implements OnInit, OnDestroy {
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @Input() suppliers: ContragentShortInfo[];
  @Input() proposals: KimPriceOrderProposal[];
  @Input() position: KimPriceOrderPosition;
  @Input() priceOrder: KimPriceOrder;
  @Input() chooseBy$: Subject<"date" | "price">;
  @Input() view: "list" | "grid";
  @Output() show = new EventEmitter<KimPriceOrderProposal>();
  readonly selectedProposal = new FormControl(null, Validators.required);
  readonly rejectedProposalPosition = new FormControl(null, Validators.required);
  readonly destroy$ = new Subject();

  get isReviewed(): boolean {
    return this.proposals.some(({ isWinner }) => isWinner);
  }

  constructor(private helper: ProposalHelperService) {}

  ngOnInit() {
    if (this.chooseBy$) {
      this.chooseBy$.pipe(
        tap(() => this.selectedProposal.reset()),
        tap(type => this.selectedProposal.setValue(
          this.helper.chooseBy(type, new Position(this.position, this.getPositionWithDeliveryDate), this.proposals.map(proposal => new Proposal(proposal, this.getProposalWithDeliveryDate)))
        )),
        takeUntil(this.destroy$)
      ).subscribe();
    }

    this.selectedProposal.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(v => {
        // Workaround sync with multiple elements per one formControl
        this.selectedProposal.setValue(v, {onlySelf: true, emitEvent: false});
        this.rejectedProposalPosition.reset(null, {emitEvent: false});
      });

    this.rejectedProposalPosition.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.selectedProposal.reset(null, {emitEvent: false}));
  }

  getProposal({id}: ContragentShortInfo): KimPriceOrderProposal {
    return this.proposals.find(({ proposalSupplier: { supplier } }) => supplier.id === id);
  }

  getProposalWithDeliveryDate = (proposal: KimPriceOrderProposal): Proposal<KimPriceOrderProposal> => ({
    ...proposal,
    deliveryDate: proposal.proposalSupplier.dateDelivery
  })

  getPositionWithDeliveryDate = (position): Position<KimPriceOrderPosition> => ({
    ...position,
    deliveryDate: this.priceOrder?.dateDelivery
  })

  trackByProposalPositionId = (i, supplier: ContragentShortInfo) => this.getProposal(supplier)?.id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
