import { Component, ViewChild } from '@angular/core';
import { RequestFilterCustomerListComponent } from "../request-list/request-list-filter/request-filter-customer-list/request-filter-customer-list.component";
import { RequestTpFilterComponent } from "./request-technical-proposals-filter/request-technical-proposals-filter.component";

@Component({
  selector: 'app-request-technical-proposals',
  templateUrl: './request-technical-proposals.component.html',
  styleUrls: ['./request-technical-proposals.component.scss']
})
export class RequestTechnicalProposalsComponent {

  @ViewChild(RequestTpFilterComponent, {static: false})
  requestFilterCustomerListComponent: RequestTpFilterComponent;


}
