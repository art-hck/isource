import { Component, Input } from '@angular/core';
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
  isFolded: boolean;

  constructor(
    private featureService: FeatureService,
    private userInfoService: UserInfoService
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

  isTpEditable(tp: TechnicalProposal): boolean {
    return tp.positions
      .filter(() => this.featureService.available('editTechnicalProposal', this.userInfoService.roles))
      .filter(() => tp.status !== TechnicalProposalsStatuses.SENT_TO_REVIEW)
      .some((position) => this.editableStatuses.indexOf(position.status) >= 0);
  }
}
