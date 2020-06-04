import { Component, Input } from '@angular/core';
import { Agreement } from "../../models/Agreement";
import { AgreementActionLink } from "../../../back-office/dictionaries/agreement-action-link";

@Component({
  selector: 'app-agreements',
  templateUrl: './agreements.component.html',
  styleUrls: ['./agreements.component.scss']
})
export class AgreementsComponent {
  @Input() agreements: Agreement[];

  getRouterLink(agreement: Agreement): any[] {
    const routerLink = ['/requests/backoffice/', agreement.request.id];
    if (AgreementActionLink[agreement.action.name]) {
      routerLink.push(AgreementActionLink[agreement.action.name]);
    }
    return routerLink;
  }
}
