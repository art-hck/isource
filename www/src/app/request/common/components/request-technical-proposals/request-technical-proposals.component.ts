import { Component, ViewChild } from '@angular/core';
import { RequestTpFilterComponent } from "./request-tp-filter/request-tp-filter.component";

@Component({
  selector: 'app-request-technical-proposals',
  templateUrl: './request-technical-proposals.component.html',
  styleUrls: ['./request-technical-proposals.component.scss']
})
export class RequestTechnicalProposalsComponent {

  @ViewChild(RequestTpFilterComponent, {static: false})
  requestTpFilterCustomerListComponent: RequestTpFilterComponent;


}
