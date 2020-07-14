import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Actions, Store } from "@ngxs/store";
import { Subject } from "rxjs";
import { getCurrencySymbol } from "@angular/common";
import { finalize, takeUntil, tap } from "rxjs/operators";
import { RequestPosition } from "../../../common/models/request-position";
import { Proposal } from "../../../../shared/components/grid/proposal";
import { RequestOfferPosition } from "../../../common/models/request-offer-position";
import { Position } from "../../../../shared/components/grid/position";
import { FormControl, Validators } from "@angular/forms";
import { ProposalHelperService } from "../../../../shared/components/grid/proposal-helper.service";
import { CommercialProposals } from "../../actions/commercial-proposal.actions";
import Approve = CommercialProposals.Approve;

@Component({
  selector: 'app-commercial-proposal-list',
  templateUrl: './commercial-proposal-list.component.html',
  styleUrls: ['commercial-proposal-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommercialProposalListComponent implements OnDestroy, OnInit {
  @Input() position: Position<RequestPosition>;
  @Input() proposals: Proposal<RequestOfferPosition>[];
  @Input() chooseBy$: Subject<"date" | "price">;
  @Input() requestId: Uuid;
  @Output() show = new EventEmitter<Proposal<RequestOfferPosition>>();
  readonly destroy$ = new Subject();
  getCurrencySymbol = getCurrencySymbol;
  selectedProposal = new FormControl(null, Validators.required);
  rejectedProposal = new FormControl(null, Validators.required);
  sendToEditProposal = new FormControl(null, Validators.required);
  folded = false;
  gridRows = [];

  get isReviewed(): boolean {
    return this.proposals.some(({ isWinner }) => isWinner);
  }

  constructor(
    public helper: ProposalHelperService,
    private store: Store,
    private actions: Actions,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.chooseBy$) {
      this.chooseBy$.pipe(
        tap(type => this.selectedProposal.setValue(this.helper.chooseBy(type, this.position, this.proposals))),
        takeUntil(this.destroy$)
      ).subscribe(() => this.cd.detectChanges());
    }

    // Workaround sync with multiple elements per one formControl
    this.selectedProposal.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => this.selectedProposal.setValue(v, {onlySelf: true, emitEvent: false}));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  approve() {
    this.dispatchAction(new Approve(this.requestId, {[this.position.id]: this.selectedProposal.value.id}));
  }

  reject() {
    // TODO: Ждём бэк
    // this.dispatchAction(new Reject(this.requestId, this.proposalByPos.position));
  }

  private dispatchAction(action) {
    this.selectedProposal.disable();
    this.store.dispatch(action).pipe(
      finalize(() => this.selectedProposal.enable()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  trackByProposaId = (i, {id}: Proposal) => id;
}
