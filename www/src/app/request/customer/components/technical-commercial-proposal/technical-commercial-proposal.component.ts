import {
  Component,
  ElementRef, EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { getCurrencySymbol } from "@angular/common";
import { Subject } from "rxjs";
import { UxgModalComponent } from "uxg";
import { FormControl, Validators } from "@angular/forms";
import { finalize, takeUntil } from "rxjs/operators";
import { TechnicalCommercialProposalHelperService } from "../../../common/services/technical-commercial-proposal-helper.service";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { Position } from "../../../../shared/components/grid/position";
import ReviewMultiple = TechnicalCommercialProposals.ReviewMultiple;
import { TechnicalCommercialProposalPositionStatus } from "../../../common/enum/technical-commercial-proposal-position-status";
import SendToEditMultiple = TechnicalCommercialProposals.SendToEditMultiple;

@Component({
  selector: "app-request-technical-commercial-proposal",
  templateUrl: './technical-commercial-proposal.component.html',
  styleUrls: ['technical-commercial-proposal.component.scss'],
})

export class TechnicalCommercialProposalComponent implements OnInit, OnDestroy {
  @ViewChild("proposalModal") proposalModal: UxgModalComponent;
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @Input() proposal: TechnicalCommercialProposal;
  @Input() proposals: TechnicalCommercialProposal[];
  @Input() technicalCommercialProposalIndex: number;
  @Input() requestId: Uuid;
  @Input() chooseBy$: Subject<"date" | "price">;
  @Output() positionSelected = new EventEmitter();
  readonly destroy$ = new Subject();
  selectedTechnicalCommercialProposalsPositions: TechnicalCommercialProposalPosition[] = [];
  position: Position;
  getCurrencySymbol = getCurrencySymbol;
  selectedProposal = new FormControl(null, Validators.required);
  sendToEditPosition = new FormControl(null, Validators.required);
  folded = false;
  isLoading: boolean;

  get hasOnReview(): boolean {
    return this.proposal.positions.some(({ status }) => ['SENT_TO_REVIEW'].includes(status));
  }

  get hasSentToEdit(): boolean {
    return this.proposal.positions.some(({ status }) => ['SENT_TO_EDIT'].includes(status)) && this.proposal.positions.length > 0;
  }

  get isReviewed(): boolean {
    return this.proposal.positions.every(({ status }) => ['APPROVED', 'REJECTED'].includes(status));
  }

  get isSentToEdit(): boolean {
    return this.proposal.positions.every(({ status }) => ['SENT_TO_EDIT'].includes(status)) && this.proposal.positions.length > 0;
  }

  constructor(
    public helper: TechnicalCommercialProposalHelperService,
    private store: Store,
  ) {}

  ngOnInit() {
  }

  approve(): void {
    const selectedPositions = Array.from(this.selectedTechnicalCommercialProposalsPositions, (tcp) => tcp);
    this.dispatchAction(new ReviewMultiple(selectedPositions, []));
  }

  sendToEdit(): void {
    const selectedPositions = Array.from(this.selectedTechnicalCommercialProposalsPositions, (tcp) => tcp.position);
    this.dispatchAction(new SendToEditMultiple(selectedPositions));
  }

  private dispatchAction(action) {
    this.isLoading = true;

    this.store.dispatch(action).pipe(
      finalize(() => this.isLoading = false),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  hasSelectedPositions(index): boolean {
    return this.proposal.positions.some(technicalCommercialProposalPosition => {
      return this.isTechnicalCommercialProposalPositionChecked(index, technicalCommercialProposalPosition) &&
        this.isPositionSelectorAvailable(technicalCommercialProposalPosition);
    });
  }

  isPositionSelectorAvailable(tcpPosition: TechnicalCommercialProposalPosition): boolean {
    const selectorAvailableStatues = [
      TechnicalCommercialProposalPositionStatus.SENT_TO_REVIEW
    ];

    return selectorAvailableStatues.indexOf(tcpPosition.status) >= 0;
  }

  onSelectPosition(i, technicalCommercialProposalPosition: TechnicalCommercialProposalPosition): void {
    const index = this.selectedTechnicalCommercialProposalsPositions.indexOf(technicalCommercialProposalPosition);
    const data = { technicalCommercialProposalPosition, i };

    if (index === -1) {
      this.positionSelected.emit(data);
      this.selectedTechnicalCommercialProposalsPositions.push(technicalCommercialProposalPosition);
    } else {
      this.selectedTechnicalCommercialProposalsPositions.splice(index, 1);
    }
  }

  refreshPositionsSelectedState(i, technicalCommercialProposalPosition: TechnicalCommercialProposalPosition): void {
    if (this.technicalCommercialProposalIndex !== i) {
      const selectedPositionsIds = Array.from(this.selectedTechnicalCommercialProposalsPositions, ({ position }) => position.id);
      const index = selectedPositionsIds.indexOf(technicalCommercialProposalPosition.position.id);

      if (index !== -1) {
        this.selectedTechnicalCommercialProposalsPositions.splice(index, 1);
      }
    }
  }

  onSelectAllPositions(checked, i): void {
    if (checked === true) {
      this.proposal.positions.forEach(technicalCommercialProposalPosition => {
        const index = this.selectedTechnicalCommercialProposalsPositions.indexOf(technicalCommercialProposalPosition);
        const data = { technicalCommercialProposalPosition, i };

        if (!this.isProposalPositionReviewed(technicalCommercialProposalPosition) && index === -1) {
          this.positionSelected.emit(data);
          this.selectedTechnicalCommercialProposalsPositions.push(technicalCommercialProposalPosition);
        }
      });
    } else {
      this.selectedTechnicalCommercialProposalsPositions = [];
    }
  }

  isTechnicalCommercialProposalPositionChecked(i, tcpPosition: TechnicalCommercialProposalPosition): boolean {
    const index = this.selectedTechnicalCommercialProposalsPositions.indexOf(tcpPosition);

    return index !== -1;
  }

  isProposalPositionReviewed(position): boolean {
    return [
      TechnicalCommercialProposalPositionStatus.APPROVED,
      TechnicalCommercialProposalPositionStatus.REJECTED,
      TechnicalCommercialProposalPositionStatus.SENT_TO_EDIT
    ].indexOf(position.status) > -1;
  }

  areAllPositionsChecked(technicalCommercialProposalPositions: TechnicalCommercialProposalPosition[]): boolean {
    return technicalCommercialProposalPositions.every(technicalCommercialProposalPosition => {
      return this.selectedTechnicalCommercialProposalsPositions.indexOf(technicalCommercialProposalPosition) !== -1;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
