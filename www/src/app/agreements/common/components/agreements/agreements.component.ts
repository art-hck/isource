import { Component, Input } from '@angular/core';
import { Agreement } from "../../models/Agreement";
import { AgreementActionLink } from "../../../back-office/dictionaries/agreement-action-link";
import { UserInfoService } from "../../../../user/service/user-info.service";

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent {
  @Input() agreements: Agreement[];
  @Input() dashboardView = false;

  constructor(public userInfoService: UserInfoService) {}

  getRouterLink(agreement: Agreement): any[] {
    const routerLink = [this.userInfoService.isCustomer() ? '/requests/customer/' : '/requests/backoffice/', agreement.request.id];
    if (AgreementActionLink[agreement.action.name]) {
      routerLink.push(AgreementActionLink[agreement.action.name]);
    }

    if (agreement.type === 'REQUEST_TECHNICAL_COMMERCIAL_PROPOSAL_GROUP') {
      routerLink.push(agreement.requestTechnicalCommercialProposalGroup.id);
    }

    return routerLink;
  }
}
