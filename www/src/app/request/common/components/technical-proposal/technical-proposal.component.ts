import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TechnicalProposal } from "../../models/technical-proposal";
import { TechnicalProposalsStatusesLabels } from "../../dictionaries/technical-proposals-statuses-labels";
import { TechnicalProposalPositionStatus } from "../../enum/technical-proposal-position-status";
import { TechnicalProposalsStatus } from "../../enum/technical-proposals-status";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { FeatureService } from "../../../../core/services/feature.service";
import moment from "moment";
import { TechnicalProposalsService } from "../../../back-office/services/technical-proposals.service";
import { Request } from "../../models/request";

@Component({
  selector: 'app-request-technical-proposal',
  templateUrl: './technical-proposal.component.html',
  styleUrls: ['./technical-proposal.component.scss']
})
export class RequestTechnicalProposalComponent {

  @Input() request: Request;
  @Input() technicalProposal: TechnicalProposal;
  @Output() edit = new EventEmitter<boolean>();
  @Output() update = new EventEmitter<TechnicalProposal>();
  @Output() cancelTechnicalProposal = new EventEmitter<TechnicalProposal>();
  @Output() sendTechnicalProposalToAgreement = new EventEmitter<TechnicalProposal>();

  isLoading: boolean;
  isFolded: boolean;

  public durationCancelPublish = 10 * 60;

  constructor(
    public featureService: FeatureService,
    public userInfoService: UserInfoService,
    private technicalProposalsService: TechnicalProposalsService,
  ) {
  }

  private editableStatuses = [
    TechnicalProposalPositionStatus.NEW,
    TechnicalProposalPositionStatus.EDITED,
    TechnicalProposalPositionStatus.DECLINED
  ];

  tpStatusLabel(technicalProposal: TechnicalProposal): string {
    return TechnicalProposalsStatusesLabels[technicalProposal.status];
  }

  getLabelWithCounters(technicalProposal: TechnicalProposal): string {
    const totalPositionsCount = technicalProposal.positions.length;
    const approvedPositionsCount = technicalProposal.positions.reduce(
      (count, tpPosition) => tpPosition.status === TechnicalProposalPositionStatus.ACCEPTED ? count + 1 : count, 0
    );

    return 'Согласовано ' + approvedPositionsCount + ' из ' + totalPositionsCount;
  }

  editDisabled(tp: TechnicalProposal): boolean {
    return !tp.positions
      .filter(() => tp.status !== TechnicalProposalsStatus.SENT_TO_REVIEW)
      .some((position) => this.editableStatuses.indexOf(position.status) >= 0);
  }

  availableCancelPublishTechnicalProposal(technicalProposal: TechnicalProposal) {
    return technicalProposal.status === TechnicalProposalsStatus.SENT_TO_REVIEW
      && this.getStatusChangeDuration(technicalProposal) < this.durationCancelPublish;
  }

  /**
   * Возвращает время в секундах, которое прошло с момента смены статуса ТП
   * @param technicalProposal
   */
  protected getStatusChangeDuration(technicalProposal: TechnicalProposal): number {
    return moment().diff(moment(technicalProposal.statusChangedDate), 'seconds');
  }

  onCancelPublishTechnicalProposal(technicalProposal: TechnicalProposal) {
    this.cancelTechnicalProposal.emit(technicalProposal);
  }

  sendToAgreement(technicalProposal: TechnicalProposal): void {
    this.isLoading = true;

    const subscription = this.technicalProposalsService.sendToAgreement(this.request.id, technicalProposal).subscribe(
      () => {
        this.update.emit(technicalProposal);
        this.isLoading = false;
        subscription.unsubscribe();
      }
    );
  }
}
