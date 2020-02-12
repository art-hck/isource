import { Component, Input } from '@angular/core';
import { Agreements } from "../../../dashboard/models/Agreements";
import { RequestPositionWorkflowSteps as PositionStatus } from "../../../request/common/enum/request-position-workflow-steps";

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent {
  @Input() agreements: Agreements;
  readonly labels = {
    [PositionStatus.TECHNICAL_PROPOSALS_AGREEMENT]: {
      label: "Рассмотреть ТП",
      path: "technical-proposals"
    },
    [PositionStatus.RKD_AGREEMENT]: {
      label: "Рассмотреть РКД",
      path: "design-documentation"
    },
    [PositionStatus.CONTRACT_AGREEMENT]: {
      label: "Рассмотреть договор",
      path: "contracts"
    },
    [PositionStatus.RESULTS_AGREEMENT]: {
      label: "Рассмотреть КП",
      path: "commercial-proposals"
    },
  };
}
