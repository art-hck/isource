import { NgModule } from '@angular/core';
import { CommercialProposalsComponent } from './components/commercial-proposals/commercial-proposals.component';
import { CustomerRequestViewComponent } from './components/customer-request-view/customer-request-view.component';
import { QualityComponent } from "./components/quality/quality.component";
import { QualityService } from "./services/quality.service";
import { RequestCommonModule } from "../common/request-common.module";
import { RequestComponent as CustomerRequestComponent } from './components/request/request.component';
import { RequestCustomerRoutingModule } from "./request-customer-routing.module";
import { RequestListViewComponent as CustomerRequestListViewComponent } from './components/request-list-view/request-list-view.component';
import { RequestService as CustomerRequestService } from "./services/request.service";
import { TechnicalProposalsComponent } from './components/technical-proposals/technical-proposals.component';
import { TechnicalProposalsService as CustomerTechnicalProposalsService } from "./services/technical-proposals.service";
import { RequestPositionComponent } from "./components/request-position/request-position.component";


@NgModule({
  declarations: [
    CommercialProposalsComponent,
    CustomerRequestComponent,
    CustomerRequestListViewComponent,
    CustomerRequestViewComponent,
    QualityComponent,
    RequestPositionComponent,
    TechnicalProposalsComponent
  ],
  imports: [
    RequestCustomerRoutingModule,
    RequestCommonModule,
  ],
  providers: [
    CustomerRequestService,
    CustomerTechnicalProposalsService,
    QualityService
  ]
})
export class RequestCustomerModule {
}
