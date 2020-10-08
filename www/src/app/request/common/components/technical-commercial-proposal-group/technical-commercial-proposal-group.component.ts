import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TechnicalCommercialProposalGroup } from "../../models/technical-commercial-proposal-group";
import { PositionStatusesLabels } from "../../dictionaries/position-statuses-labels";
import { PositionStatus } from "../../enum/position-status";
import { UserInfoService } from "../../../../user/service/user-info.service";

@Component({
  selector: 'app-technical-commercial-proposal-group',
  templateUrl: './technical-commercial-proposal-group.component.html',
  styleUrls: ['./technical-commercial-proposal-group.component.scss']
})
export class TechnicalCommercialProposalGroupComponent {
  @Input() technicalCommercialProposalGroup: TechnicalCommercialProposalGroup;
  @Input() editable: boolean;
  @Output() edit = new EventEmitter();
  folded = false;
  positionStatusesLabels = PositionStatusesLabels;

  constructor(
    public user: UserInfoService
  ) {
  }

  get isReviewed() {
    return this.technicalCommercialProposalGroup.requestPositions.every(({ status }) => status === PositionStatus.TCP_WINNER_SELECTED);
  }

  get publishedCount() {
    return this.technicalCommercialProposalGroup.requestPositions
      .filter(({ status }) => status !== PositionStatus.TECHNICAL_COMMERCIAL_PROPOSALS_PREPARATION).length;
  }
}
