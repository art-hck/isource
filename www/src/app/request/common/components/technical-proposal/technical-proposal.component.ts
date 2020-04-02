import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TechnicalProposal } from "../../models/technical-proposal";
import { TechnicalProposalsStatusesLabels } from "../../dictionaries/technical-proposals-statuses-labels";
import { TechnicalProposalPositionStatus } from "../../enum/technical-proposal-position-status";
import { TechnicalProposalsStatus } from "../../enum/technical-proposals-status";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { FeatureService } from "../../../../core/services/feature.service";
import * as moment from "moment";

@Component({
  selector: 'app-request-technical-proposal',
  templateUrl: './technical-proposal.component.html',
  styleUrls: ['./technical-proposal.component.scss']
})
export class RequestTechnicalProposalComponent {

  @Input() technicalProposal: TechnicalProposal;
  @Output() edit = new EventEmitter<boolean>();
  @Output() cancelTechnicalProposal = new EventEmitter<TechnicalProposal>();
  isFolded: boolean;

  protected durationCancelPublish = 10 * 60;

  constructor(
    public featureService: FeatureService,
    public userInfoService: UserInfoService
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

  onCancelPublishTechicalProposal(technicalProposal: TechnicalProposal) {
    this.cancelTechnicalProposal.emit(technicalProposal);
  }
}
