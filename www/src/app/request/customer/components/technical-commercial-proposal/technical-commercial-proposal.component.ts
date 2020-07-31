import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Actions, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { TechnicalCommercialProposalByPosition } from "../../../common/models/technical-commercial-proposal-by-position";
import { getCurrencySymbol } from "@angular/common";
import { Subject } from "rxjs";
import { UxgModalComponent } from "uxg";
import { FormControl, Validators } from "@angular/forms";
import { finalize, takeUntil, tap } from "rxjs/operators";
import { TechnicalCommercialProposalHelperService } from "../../../common/services/technical-commercial-proposal-helper.service";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { RequestPosition } from "../../../common/models/request-position";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { Position } from "../../../../shared/components/grid/position";
import Reject = TechnicalCommercialProposals.Reject;
import ReviewMultiple = TechnicalCommercialProposals.ReviewMultiple;


@Component({
  selector: "app-request-technical-commercial-proposal",
  templateUrl: './technical-commercial-proposal.component.html',
  styleUrls: ['technical-commercial-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnicalCommercialProposalComponent implements OnInit, OnDestroy {
  @ViewChild("proposalModal") proposalModal: UxgModalComponent;
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @Input() proposalByPos: TechnicalCommercialProposalByPosition;
  @Input() proposals: TechnicalCommercialProposal[];
  @Input() requestId: Uuid;
  @Input() chooseBy$: Subject<"date" | "price">;
  readonly destroy$ = new Subject();
  position: Position;
  modalData: TechnicalCommercialProposalByPosition["data"][number];

  getCurrencySymbol = getCurrencySymbol;
  selectedProposal = new FormControl(null, Validators.required);
  sendToEditPosition = new FormControl(null, Validators.required);
  folded = false;

  get isReviewed(): boolean {
    return this.proposalByPos.data.some(({ proposalPosition: p }) => ['APPROVED', 'REJECTED', 'SENT_TO_EDIT'].includes(p.status));
  }

  get hasWinner(): boolean {
    return this.proposalByPos.data.some(({ proposalPosition: p }) => ['APPROVED'].includes(p.status));
  }

  get isSentToEdit(): boolean {
    return this.proposalByPos.data.some(({proposalPosition: p}) => ['SENT_TO_EDIT'].includes(p.status)) && this.proposalByPos.data.length > 0;
  }

  constructor(
    public helper: TechnicalCommercialProposalHelperService,
    private store: Store,
    private actions: Actions,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.position = new Position(this.proposalByPos.position);

    if (this.chooseBy$) {
      this.chooseBy$.pipe(
        tap(type => this.selectedProposal.setValue(this.helper.chooseBy(type, this.proposalByPos.data))),
        takeUntil(this.destroy$))
      .subscribe(() => this.cd.detectChanges());
    }

    this.selectedProposal.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(v => {
      // Workaround sync with multiple elements per one formControl
      this.selectedProposal.setValue(v, {onlySelf: true, emitEvent: false});
      this.sendToEditPosition.reset(null, {emitEvent: false});
    });

    this.sendToEditPosition.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.selectedProposal.reset(null, {emitEvent: false}));
  }

  approve() {
    this.dispatchAction(new ReviewMultiple([this.selectedProposal.value], []));
  }

  reject() {
    this.dispatchAction(new Reject(this.requestId, this.proposalByPos.position));
  }

  private dispatchAction(action) {
    this.selectedProposal.disable();
    this.store.dispatch(action).pipe(
      finalize(() => this.selectedProposal.enable()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getProposalPosition({positions}: TechnicalCommercialProposal, {id}: RequestPosition): TechnicalCommercialProposalPosition {
    return positions.find(({position}) => position.id === id);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByproposalPositionId = (i, {proposalPosition}: TechnicalCommercialProposalByPosition["data"][number]) => proposalPosition.id;
}
