import { Component, Input } from '@angular/core';
import { Request } from "../../models/request";
import { TechnicalProposal } from "../../models/technical-proposal";
import { TechnicalProposalsService } from "../../../back-office/services/technical-proposals.service";
import { ActivatedRoute } from "@angular/router";
import { TechnicalProposalsStatusesLabels } from "../../dictionaries/technical-proposals-statuses-labels";
import { TechnicalProposalPositionStatuses } from "../../enum/technical-proposal-position-statuses";
import { TechnicalProposalPosition } from "../../models/technical-proposal-position";
import { TechnicalProposalsStatuses } from "../../enum/technical-proposals-statuses";

@Component({
  selector: 'app-request-technical-proposals',
  templateUrl: './request-technical-proposals.component.html',
  styleUrls: ['./request-technical-proposals.component.scss']
})
export class RequestTechnicalProposalsComponent {

  request: Request;
  @Input() technicalProposals: TechnicalProposal[];

  isFolded = [];

  protected editableStatuses = [
    TechnicalProposalPositionStatuses.NEW.valueOf(),
    TechnicalProposalPositionStatuses.EDITED.valueOf(),
    TechnicalProposalPositionStatuses.DECLINED.valueOf()
  ];

  constructor(
    private route: ActivatedRoute,
    private technicalProposalsService: TechnicalProposalsService
  ) {
  }

  tpStatusLabel(technicalProposal: TechnicalProposal): string {
    return TechnicalProposalsStatusesLabels[technicalProposal.status];
  }

  isTpEditable(tp: TechnicalProposal): boolean {
    if (tp.status === TechnicalProposalsStatuses.SENT_TO_REVIEW) {
      return false;
    }
    return tp.positions.some((position) => {
      return this.isEditablePosition(position);
    });
  }

  isEditablePosition(position: TechnicalProposalPosition): boolean {
    return this.editableStatuses.indexOf(position.status) >= 0;
  }
}
