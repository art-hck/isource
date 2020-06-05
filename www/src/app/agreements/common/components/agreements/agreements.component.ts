import { Component, Input } from '@angular/core';
import { Agreement } from "../../models/Agreement";
import { AgreementAction } from "../../../back-office/enum/agreement-action";
import { PaymentTermsLabels } from "../../../../request/common/dictionaries/payment-terms-labels";
import { AgreementActionLabel } from "../../../back-office/enum/agreement-action-label";

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent {
  @Input() agreements: Agreement[];
  readonly labels = {
    [AgreementAction.PROCESS_REQUEST]: {
      label: "Обработать заявку",
      path: ''
    },
    [AgreementAction.WORK_ON_REQUEST]: {
      label: "Принять в работу",
      path: ''
    }
  };

  getRouterLink(agreement: Agreement): any[] {
    const routerLink = ['/requests/backoffice', agreement.request.id];

    if (this.labels[agreement.action.name] && this.labels[agreement.action.name].path) {
      routerLink.push(this.labels[agreement.action.name].path);
    }
    return routerLink;
  }

}
