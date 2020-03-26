import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Actions, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { TechnicalCommercialProposalGroupByPosition } from "../../../common/models/technical-commercial-proposal-group-by-position";
import { getCurrencySymbol } from "@angular/common";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { Subject } from "rxjs";
import { ClrModal } from "@clr/angular";
import { FormControl, Validators } from "@angular/forms";
import { finalize, takeUntil, tap } from "rxjs/operators";
import * as moment from "moment";
import Approve = TechnicalCommercialProposals.Approve;
import Reject = TechnicalCommercialProposals.Reject;

@Component({
  selector: "app-request-technical-commercial-proposal",
  templateUrl: './technical-commercial-proposal.component.html',
  styleUrls: ['technical-commercial-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalComponent implements OnInit, OnDestroy {
  @Input() group: TechnicalCommercialProposalGroupByPosition;
  @Input() requestId: Uuid;
  @ViewChild("proposalModal", {static: false}) proposalModal: ClrModal;
  @Input() chooseBy$: Subject<"date" | "price">;
  readonly destroy$ = new Subject();

  getCurrencySymbol = getCurrencySymbol;
  selectedProposalPosition = new FormControl(null, Validators.required);
  folded = false;

  get isReviewed(): boolean {
    return this.group.data.every(({ proposal }) => proposal.status === 'REVIEWED');
  }

  constructor(
    private store: Store,
    private actions: Actions,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.chooseBy$) {
      this.chooseBy$.pipe(takeUntil(this.destroy$), tap(type => {
        switch (type) {
          case "price":
            this.chooseBy((prev, curr) => {
              const prevValid = this.isValid(prev.proposalPosition);
              const currValid = this.isValid(curr.proposalPosition);
              if (prevValid && !currValid) { return prev; }
              if (!prevValid && currValid) { return curr; }
              if (!prevValid && !currValid) { return null; }
              return prev.proposalPosition.priceWithoutVat <= curr.proposalPosition.priceWithoutVat  ? prev : curr;
            });
          break;
          case "date":
            this.chooseBy((prev, curr) => {
              const prevValid = this.isValid(prev.proposalPosition);
              const currValid = this.isValid(curr.proposalPosition);
              if (prevValid && !currValid) { return prev; }
              if (!prevValid && currValid) { return curr; }
              if (!prevValid && !currValid) { return null; }
              return +new Date(prev.proposalPosition.deliveryDate) <= +new Date(curr.proposalPosition.deliveryDate)  ? prev : curr;
            });
          break;
        }
      }))
      .subscribe(() => this.cd.detectChanges());
    }

    // Workaround sync with multiple elements per one formControl
    this.selectedProposalPosition.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => this.selectedProposalPosition.setValue(v, {onlySelf: true, emitEvent: false}));
  }

  approve() {
    this.dispatchAction(new Approve(this.requestId, this.selectedProposalPosition.value));
  }

  reject() {
    this.dispatchAction(new Reject(this.requestId, this.group.position));
  }

  isValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return this.isDateValid(proposalPosition) && this.isQuantityValid(proposalPosition);
  }

  isDateValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return moment(proposalPosition.deliveryDate).isSameOrBefore(moment(proposalPosition.position.deliveryDate));
  }

  isQuantityValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return proposalPosition.quantity === proposalPosition.position.quantity;
  }

  private dispatchAction(action) {
    this.selectedProposalPosition.disable();
    this.store.dispatch(action).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.selectedProposalPosition.enable())
    ).subscribe();
  }

  private chooseBy(by: (p, c) => typeof p | typeof c | null) {
    const item = this.group.data.reduce(by);
    return item && this.selectedProposalPosition.setValue(item.proposalPosition);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByproposalPositionId = (i, {proposalPosition}) => proposalPosition.id;
}
