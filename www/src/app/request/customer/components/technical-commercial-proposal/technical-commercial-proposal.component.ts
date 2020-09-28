import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input, OnChanges,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Uuid } from "../../../../cart/models/uuid";
import { Select, Store } from "@ngxs/store";
import { TechnicalCommercialProposals } from "../../actions/technical-commercial-proposal.actions";
import { getCurrencySymbol } from "@angular/common";
import { Observable, Subject } from "rxjs";
import { UxgModalComponent } from "uxg";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { filter, finalize, takeUntil, tap } from "rxjs/operators";
import { TechnicalCommercialProposalHelperService } from "../../../common/services/technical-commercial-proposal-helper.service";
import { TechnicalCommercialProposal } from "../../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalPosition } from "../../../common/models/technical-commercial-proposal-position";
import { Position } from "../../../../shared/components/grid/position";
import ReviewMultiple = TechnicalCommercialProposals.ReviewMultiple;
import { TechnicalCommercialProposalPositionStatus } from "../../../common/enum/technical-commercial-proposal-position-status";
import SendToEditMultiple = TechnicalCommercialProposals.SendToEditMultiple;
import { TechnicalCommercialProposalByPosition } from "../../../common/models/technical-commercial-proposal-by-position";
import { TechnicalCommercialProposalState } from "../../states/technical-commercial-proposal.state";
import { StateStatus } from "../../../common/models/state-status";

@Component({
  selector: "app-request-technical-commercial-proposal",
  templateUrl: './technical-commercial-proposal.component.html',
  styleUrls: ['technical-commercial-proposal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TechnicalCommercialProposalComponent implements OnChanges, OnDestroy {
  @Select(TechnicalCommercialProposalState.status)
  readonly stateStatus$: Observable<StateStatus>;

  @ViewChild("proposalModal") proposalModal: UxgModalComponent;
  @ViewChildren('gridRow') gridRows: QueryList<ElementRef>;
  @Input() proposalByPos: TechnicalCommercialProposalByPosition;
  @Input() proposal: TechnicalCommercialProposal;
  @Input() proposals: TechnicalCommercialProposal[];
  @Input() technicalCommercialProposalIndex: number;
  @Input() requestId: Uuid;
  @Input() chooseBy$: Subject<"date" | "price">;
  @Input() isLoading: boolean;
  @Output() positionSelected = new EventEmitter();
  readonly destroy$ = new Subject();
  position: Position;
  getCurrencySymbol = getCurrencySymbol;
  selectedProposal = new FormControl(null, Validators.required);
  sendToEditPosition = new FormControl(null, Validators.required);
  folded = false;
  form: FormGroup;
  someFilterVar = true;

  get selectedPositions(): TechnicalCommercialProposalPosition[] {
    return (this.form.get('positions') as FormArray).controls
      ?.filter(({value}) => value.checked)
      .map(({value}) => (value.position));
  }

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
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnChanges() {
    if (this.chooseBy$) {
      this.chooseBy$.pipe(
        tap(type => {
          this.getNotReviewedPositionsByProposals(this.proposals).forEach((position) => {
            const proposalsWithPosition = this.getAllProposalsWithPosition(position);
            const proposalToCheck = this.helper.chooseBy(type, position, proposalsWithPosition);
            const proposalPositionToCheck = this.getTcpPositionByPositionAndProposal(position, proposalToCheck);

            (this.form.get('positions') as FormArray).controls?.map(
              (control) => {
                if (proposalPositionToCheck && !control.disabled && control.value.position.id === proposalPositionToCheck.id) {
                  control.get('checked').setValue(true);
                }
              }
            );
          });
        }),
        takeUntil(this.destroy$)
      ).subscribe(() => this.cd.detectChanges());
    }

    this.form = this.fb.group({
      checked: false,
      positions: this.fb.array(this.proposal.positions.map(position => {
        const form = this.fb.group({ checked: false, position });
        if (this.isProposalPositionReviewed(position)) {
          form.get("checked").disable();
        }
        return form;
      }))
    });

    this.form.valueChanges.pipe(
      filter(() => this.someFilterVar)).subscribe(() => {
        if (this.selectedPositions.length > 0) {
          const selectedPositions = this.selectedPositions;
          const index = this.technicalCommercialProposalIndex;

          const data = { selectedPositions, index };

          this.someFilterVar = false;
          this.positionSelected.emit(data);
          this.someFilterVar = true;
        }
      }
    );
  }

  approve(): void {
    if (this.selectedPositions) {
      const selectedPositions = Array.from(this.selectedPositions, (tcp) => tcp);
      this.dispatchAction(new ReviewMultiple(selectedPositions, []));
    }
  }

  sendToEdit(): void {
    if (this.selectedPositions) {
      const selectedPositions = Array.from(this.selectedPositions, (tcp) => tcp.position);
      this.dispatchAction(new SendToEditMultiple(selectedPositions));
    }
  }

  private dispatchAction(action): void {
    this.isLoading = true;

    this.store.dispatch(action).pipe(
      finalize(() => {
        this.isLoading = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  /**
   * Имея в распоряжении позицию и ткп-предложение, получаем из последней ткп-позицию
   */
  getTcpPositionByPositionAndProposal(position, proposal): TechnicalCommercialProposalPosition {
    return proposal?.positions?.find(pos => pos.position.id === position.position.id);
  }

  /**
   * Получаем список всех позиций, по которым созданы ТКП
   */
  getNotReviewedPositionsByProposals(proposals): TechnicalCommercialProposalPosition[] {
    const flatProposalsPositions = proposals.map(({positions}) => positions);

    const allPositionsByProposals = flatProposalsPositions.flat(1).filter((position, index, array) =>
      !array.filter((v, i) => JSON.stringify(position.position.id) === JSON.stringify(v.position.id) && i < index).length);

    return allPositionsByProposals.filter(position => !this.isProposalPositionReviewed(position));
  }

  /**
   * Получаем все ТКП, в которых участвует указанная позиция
   */
  getAllProposalsWithPosition(proposalPosition): TechnicalCommercialProposal[] {
    // Получаем все ТКП, в которых участвует указанная позиция
    return this.proposals.filter(({ positions }) => positions.find(pos => pos.position.id === proposalPosition.position.id));
  }

  // Функция сбрасывает чекбоксы во всех ТКП у тех позиций, которые становятся отмечены в другом ТКП
  refreshPositionsSelectedState(i, checkedTechnicalCommercialProposalPositions: TechnicalCommercialProposalPosition[]): void {
    if (this.technicalCommercialProposalIndex !== i) {
      const checkedPositionsIds = checkedTechnicalCommercialProposalPositions.map(({position}) => position.id);

      (this.form.get('positions') as FormArray).controls?.forEach(
        (control) => {
          const index = checkedPositionsIds.indexOf(control.value.position.position.id);

          if (index !== -1 && control.get('checked').value === true) {
            control.get('checked').setValue(false);
          }
        }
      );

      this.cd.detectChanges();
    }
  }

  isProposalPositionReviewed(position): boolean {
    return [
      TechnicalCommercialProposalPositionStatus.APPROVED,
      TechnicalCommercialProposalPositionStatus.REJECTED,
      TechnicalCommercialProposalPositionStatus.SENT_TO_EDIT
    ].indexOf(position.status) > -1;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
