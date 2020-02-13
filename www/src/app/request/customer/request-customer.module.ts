import { NgModule } from '@angular/core';
import { CommercialProposalsComponent } from './components/commercial-proposals/commercial-proposals.component';
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
import { RequestTechnicalProposalsComponent } from './components/request-technical-proposals/request-technical-proposals.component';
import { RequestCommercialProposalsComponent } from './components/request-commercial-proposals/request-commercial-proposals.component';
import { RequestAgreementsComponent } from './components/request-agreements/request-agreements.component';
import { AgreementsModule } from "../../agreements/agreements.module";


@NgModule({
  declarations: [
    CommercialProposalsComponent,
    CustomerRequestComponent,
    CustomerRequestListViewComponent,
    QualityComponent,
    RequestPositionComponent,
    TechnicalProposalsComponent,
    RequestTechnicalProposalsComponent,
    RequestCommercialProposalsComponent,
    RequestAgreementsComponent
  ],
  imports: [
    AgreementsModule,
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
