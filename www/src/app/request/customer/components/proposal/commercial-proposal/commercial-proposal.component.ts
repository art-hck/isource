import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Uuid } from "../../../../../cart/models/uuid";
import { Actions, Store } from "@ngxs/store";
import { Subject } from "rxjs";
import { getCurrencySymbol } from "@angular/common";
import { finalize, takeUntil, tap } from "rxjs/operators";
import { RequestPosition } from "../../../../common/models/request-position";
import { Proposal } from "../../../../../shared/components/grid/proposal";
import { RequestOfferPosition } from "../../../../common/models/request-offer-position";
import { Position } from "../../../../../shared/components/grid/position";
import { FormControl, Validators } from "@angular/forms";
import { ProposalHelperService } from "../../../../../shared/components/grid/proposal-helper.service";
import { CommercialProposals } from "../../../actions/commercial-proposal.actions";
import { CommercialProposalsStatus } from "../../../../common/enum/commercial-proposals-status";
import Review = CommercialProposals.Review;

@Component({
  selector: 'app-commercial-proposal',
  template: '',
  // templateUrl: './commercial-proposal.component.html',
  // styleUrls: ['commercial-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommercialProposalComponent implements OnDestroy, OnInit {
  // @Input() position: Position<RequestPosition>;
  // @Input() proposals: Proposal<RequestOfferPosition>[];
  // @Input() chooseBy$: Subject<"date" | "price">;
  // @Input() requestId: Uuid;
  // @Input() groupId: Uuid;
  // @Output() show = new EventEmitter<Proposal<RequestOfferPosition>>();
  // readonly destroy$ = new Subject();
  // getCurrencySymbol = getCurrencySymbol;
  // selectedProposal = new FormControl(null, Validators.required);
  // rejectedProposal = new FormControl(null, Validators.required);
  // sendToEditPosition = new FormControl(null, Validators.required);
  // folded = false;
  // gridRows = [];
  //
  // get isReviewed(): boolean {
  //   return this.proposals.some(({ isWinner }) => isWinner);
  // }
  //
  // get isSentToEdit(): boolean {
  //   return this.proposals.every(proposal => proposal.sourceProposal.status === CommercialProposalsStatus.SENT_TO_EDIT);
  // }
  //
  // constructor(
  //   public helper: ProposalHelperService,
  //   private store: Store,
  //   private actions: Actions,
  //   private cd: ChangeDetectorRef
  // ) {}
  //
  ngOnInit() {
  //   if (this.chooseBy$) {
  //     this.chooseBy$.pipe(
  //       tap(type => this.selectedProposal.setValue(this.helper.chooseBy(type, this.position, this.proposals))),
  //       takeUntil(this.destroy$)
  //     ).subscribe(() => this.cd.detectChanges());
  //   }
  //
  //   // Workaround sync with multiple elements per one formControl
  //   this.selectedProposal.valueChanges
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(v => this.selectedProposal.setValue(v, {onlySelf: true, emitEvent: false}));
  }
  //
  ngOnDestroy() {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  }
  //
  // approve() {
  //   this.dispatchAction(new Review(this.requestId, this.groupId, { accepted: { [this.position.id]: this.selectedProposal.value.id } }));
  // }
  //
  // reject() {
  //   // TODO: Ждём бэк
  // }
  //
  // sendToEdit() {
  //   this.dispatchAction(new Review(this.requestId, this.groupId, { sendToEdit: [this.position.id] }));
  // }
  //
  // private dispatchAction(action) {
  //   this.selectedProposal.disable();
  //   this.store.dispatch(action).pipe(
  //     finalize(() => this.selectedProposal.enable()),
  //     takeUntil(this.destroy$)
  //   ).subscribe();
  // }
  //
  // trackByProposalId = (i, {id}: Proposal) => id;
}
