import { Component, Inject, Input } from '@angular/core';
import { PositionStatus } from "../../../../request/common/enum/position-status";
import { RequestPosition } from "../../../../request/common/models/request-position";
import { AgreementsResponse } from "../../models/agreements-response";
import { APP_CONFIG, GpnmarketConfigInterface } from "../../../../core/config/gpnmarket-config.interface";

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent {
  @Input() agreements: RequestPosition[];
  readonly labels = {
    [PositionStatus.TECHNICAL_PROPOSALS_AGREEMENT]: {
      label: "Рассмотреть ТП",
      path: "technical-proposals"
    },
    [PositionStatus.RKD_AGREEMENT]: {
      label: "Рассмотреть РКД",
      path: "design-documentation"
    },
    [PositionStatus.TECHNICAL_COMMERCIAL_PROPOSALS_AGREEMENT]: {
      label: "Рассмотреть ТКП",
      path: "technical-commercial-proposals"
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
