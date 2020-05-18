import { Component, Input, OnInit } from '@angular/core';
import { TechnicalProposal } from "../../../common/models/technical-proposal";
import { TechnicalProposalsStatusesLabels } from "../../../common/dictionaries/technical-proposals-statuses-labels";
import { TechnicalProposalPositionStatus } from "../../../common/enum/technical-proposal-position-status";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { FeatureService } from "../../../../core/services/feature.service";
import { TechnicalProposalsService } from "../../../back-office/services/technical-proposals.service";
import { Request } from "../../../common/models/request";
import { TechnicalProposalPosition } from "../../../common/models/technical-proposal-position";
import { TechnicalProposals } from "../../actions/technical-proposal.actions";
import { Actions, ofActionCompleted, Store } from "@ngxs/store";
import { takeUntil } from "rxjs/operators";
import { ToastActions } from "../../../../shared/actions/toast.actions";
import { Subject } from "rxjs";
import { PluralizePipe } from "../../../../shared/pipes/pluralize-pipe";

import Update = TechnicalProposals.Update;
import Approve = TechnicalProposals.Approve;
import Reject = TechnicalProposals.Reject;

@Component({
  selector: 'app-request-customer-technical-proposal',
  templateUrl: './technical-proposal.component.html',
  styleUrls: ['./technical-proposal.component.scss'],
  providers: [PluralizePipe]
})
export class RequestTechnicalProposalComponent implements OnInit {

  @Input() request: Request;
  @Input() technicalProposals: TechnicalProposal[];
  @Input() technicalProposal: TechnicalProposal;
  @Input() technicalProposalIndex: number;
  @Input() currentList: string;

  isLoading: boolean;
  isFolded: boolean;

  readonly destroy$ = new Subject();
  selectedTechnicalProposalsPositions: TechnicalProposalPosition[][] = [];

  constructor(
    public featureService: FeatureService,
    public userInfoService: UserInfoService,
    private technicalProposalsService: TechnicalProposalsService,
    private actions: Actions,
    private store: Store,
    private pluralize: PluralizePipe,
  ) {
  }

  ngOnInit() {
    this.actions.pipe(
      ofActionCompleted(Approve, Reject),
      takeUntil(this.destroy$)
    ).subscribe(({result, action}) => {
      const e = result.error as any;
      const length = action?.proposalPosition.length ?? 1;
      const text = (action instanceof Reject ? "$1" : "$0")
        .replace(/\$(\d)/g, (all, i) => [
        this.pluralize.transform(length, "позиция отклонена", "позиции отклонены", "позиций отклонено"),
        this.pluralize.transform(length, "предложение отклонено", "предложения отклонены", "предложений отклонено"),
      ][i] || all);

      this.store.dispatch(e ?
        new ToastActions.Error(e && e.error.detail) : new ToastActions.Success(text)
      );
    });

    for (let i = 0; i < this.technicalProposals.length; i++) {
      this.selectedTechnicalProposalsPositions[i] = [];
    }
  }

  tpStatusLabel(technicalProposal: TechnicalProposal): string {
    return TechnicalProposalsStatusesLabels[technicalProposal.status];
  }

  approve() {
    this.isLoading = true;

    this.store.dispatch(new Approve(
      this.request.id,
      this.technicalProposal.id,
      this.selectedTechnicalProposalsPositions[this.technicalProposalIndex]
    )).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch(new Update(this.request.id)).subscribe(() => this.isLoading = false);
    });
  }

  reject() {
    this.isLoading = true;

    this.store.dispatch(new Reject(
      this.request.id,
      this.technicalProposal.id,
      this.selectedTechnicalProposalsPositions[this.technicalProposalIndex]
    )).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch(new Update(this.request.id)).subscribe(() => this.isLoading = false);
    });
  }

  onSelectPosition(i, technicalProposalPosition: TechnicalProposalPosition): void {
    const index = this.selectedTechnicalProposalsPositions[i].indexOf(technicalProposalPosition);

    if (index === -1) {
      this.selectedTechnicalProposalsPositions[i].push(technicalProposalPosition);
    } else {
      this.selectedTechnicalProposalsPositions[i].splice(index, 1);
    }
  }

  onSelectAllPositions(checked, i): void {
    if (checked === true) {
      this.technicalProposal.positions.forEach(technicalProposalPosition => {
        const index = this.selectedTechnicalProposalsPositions[i].indexOf(technicalProposalPosition);

        if (!this.isProposalPositionReviewed(technicalProposalPosition) && index === -1) {
          this.selectedTechnicalProposalsPositions[i].push(technicalProposalPosition);
        }
      });
    } else {
      this.selectedTechnicalProposalsPositions[i] = [];
    }
  }

  areAllPositionsChecked(technicalProposalPositions: TechnicalProposalPosition[]): boolean {
    return !technicalProposalPositions.some(
      technicalProposalPosition => technicalProposalPosition.checked !== true
    );
  }

  hasSelectablePositions(technicalProposalPositions: TechnicalProposalPosition[]): boolean {
    return technicalProposalPositions.some(technicalProposalPosition =>
      this.isPositionSelectorAvailable(technicalProposalPosition));
  }

  hasSelectedPositions(index): boolean {
    return this.technicalProposal.positions.some(technicalProposalPosition => {
      return this.isTechnicalProposalPositionChecked(index, technicalProposalPosition) &&
             this.isPositionSelectorAvailable(technicalProposalPosition);
    });
  }

  isPositionSelectorAvailable(tpPosition: TechnicalProposalPosition): boolean {
    const selectorAvailableStatues = [
      TechnicalProposalPositionStatus.REVIEW.valueOf()
    ];
    return selectorAvailableStatues.indexOf(tpPosition.status) >= 0;
  }

  isTechnicalProposalPositionChecked(i, tpPosition: TechnicalProposalPosition): boolean {
    const index = this.selectedTechnicalProposalsPositions[i].indexOf(tpPosition);

    return index !== -1;
  }

  isProposalPositionReviewed(position): boolean {
    return ['ACCEPTED', 'DECLINED'].indexOf(position.status) > -1;
  }
}
