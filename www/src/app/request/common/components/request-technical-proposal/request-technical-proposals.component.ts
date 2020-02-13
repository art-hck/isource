import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TechnicalProposal } from "../../models/technical-proposal";
import { TechnicalProposalsStatusesLabels } from "../../dictionaries/technical-proposals-statuses-labels";
import { TechnicalProposalPositionStatus } from "../../enum/technical-proposal-position-status";
import { TechnicalProposalsStatuses } from "../../enum/technical-proposals-statuses";
import { UserInfoService } from "../../../../user/service/user-info.service";
import { FeatureService } from "../../../../core/services/feature.service";

@Component({
  selector: 'app-request-technical-proposal',
  templateUrl: './request-technical-proposals.component.html',
  styleUrls: ['./request-technical-proposals.component.scss']
})
export class RequestTechnicalProposalComponent {

  @Input() technicalProposal: TechnicalProposal;
  @Output() edit = new EventEmitter<boolean>();
  isFolded: boolean;

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
      .filter(() => tp.status !== TechnicalProposalsStatuses.SENT_TO_REVIEW)
      .some((position) => this.editableStatuses.indexOf(position.status) >= 0);
  }
}
