import { Component, Input } from '@angular/core';
import { RequestPositionWorkflowSteps as PositionStatus } from "../../../request/common/enum/request-position-workflow-steps";
import { RequestPosition } from "../../../request/common/models/request-position";

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent {
  @Input() positions: RequestPosition[];
  @Input() total: number;
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
    [PositionStatus.ON_CUSTOMER_APPROVAL]: {
      label: "Рассмотреть позицию"
    },
  };

  getRouterLink(position: RequestPosition): any[] {
    const routerLink = ['/requests/customer', position.request.id];

    if (this.labels[position.status] && this.labels[position.status].path) {
      routerLink.push(this.labels[position.status].path);
    }
    return routerLink;
  }
}
