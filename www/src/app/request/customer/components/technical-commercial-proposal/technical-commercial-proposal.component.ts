import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { TechnicalCommercialProposalGroupByPosition } from "../../../common/models/technical-commercial-proposal-group-by-position";
import { getCurrencySymbol } from "@angular/common";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { StateStatus } from "../../../common/models/state-status";
import { Observable, Subject } from "rxjs";
import { ClrModal } from "@clr/angular";
import { FormControl } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
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
  @Select(TechnicalCommercialProposalState.status) status$: Observable<StateStatus>;
  @Input() chooseBy$: Subject<"date" | "price">;
  readonly destroy$ = new Subject();

  getCurrencySymbol = getCurrencySymbol;
  selectedProposalPosition = new FormControl(null);
  folded = false;

  ngOnInit() {
    if (this.chooseBy$) {
      this.chooseBy$.pipe(takeUntil(this.destroy$)).subscribe((type) => {
        switch (type) {
          case "price":
            this.chooseBy((prev, curr) => {
              const prevValid = this.isValid(prev.proposalPosition);
              const currValid = this.isValid(curr.proposalPosition);
              if (prevValid && !currValid) { return prev; }
              if (!prevValid && currValid) { return curr; }
              return prev.proposalPosition.priceWithoutVat <= curr.proposalPosition.priceWithoutVat  ? prev : curr;
            });
          break;
          case "date":
            this.chooseBy((prev, curr) => {
              const prevValid = this.isValid(prev.proposalPosition);
              const currValid = this.isValid(curr.proposalPosition);
              if (prevValid && !currValid) { return prev; }
              if (!prevValid && currValid) { return curr; }
              return +new Date(prev.proposalPosition.deliveryDate) <= +new Date(curr.proposalPosition.deliveryDate)  ? prev : curr;
            });
          break;
        }
      });
    }

    this.status$.pipe(takeUntil(this.destroy$)).subscribe(status => {
      status !== "received" ? this.selectedProposalPosition.disable() : this.selectedProposalPosition.enable();
    });

    // Workaround sync with multiple elements per one formControl
    this.selectedProposalPosition.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => this.selectedProposalPosition.setValue(v, {onlySelf: true, emitEvent: false}));
  }

  get isReviewed() {
    return this.group.data.every(({ proposal }) => proposal.status === 'REVIEWED');
  }

  constructor(private store: Store, public cd: ChangeDetectorRef) {}

  approve(proposalPosition: TechnicalCommercialProposalPosition) {
    this.store.dispatch(new Approve(this.requestId, proposalPosition));
  }

  reject() {
    this.store.dispatch(new Reject(this.requestId, this.group.position));
  }

  isValid(proposalPosition: TechnicalCommercialProposalPosition) {
    return this.isDateValid(proposalPosition) && this.isQuantityValid(proposalPosition);
  }

  isDateValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return moment(proposalPosition.deliveryDate).isSameOrBefore(moment(proposalPosition.position.deliveryDate));
  }

  isQuantityValid(proposalPosition: TechnicalCommercialProposalPosition): boolean {
    return proposalPosition.quantity >= proposalPosition.position.quantity;
  }

  private chooseBy(by: (p, c) => typeof p | typeof c) {
    this.selectedProposalPosition.setValue(this.group.data.reduce(by).proposalPosition);
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByproposalPositionId = (i, {proposalPosition}) => proposalPosition.id;
}
