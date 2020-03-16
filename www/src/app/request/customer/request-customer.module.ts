import { NgModule } from '@angular/core';
import { CommercialProposalsComponent } from './components/commercial-proposal-list-old/commercial-proposals.component';
import { RequestCommonModule } from "../common/request-common.module";
import { RequestComponent as CustomerRequestComponent } from './components/request/request.component';
import { RequestCustomerRoutingModule } from "./request-customer-routing.module";
import { RequestListViewComponent as CustomerRequestListViewComponent } from './components/request-list/request-list-view.component';
import { RequestService as CustomerRequestService } from "./services/request.service";
import { TechnicalProposalsComponent } from './components/technical-proposal-list-deprecated/technical-proposals.component';
import { TechnicalProposalsService as CustomerTechnicalProposalsService } from "./services/technical-proposals.service";
import { RequestPositionComponent } from "./components/position/request-position.component";
import { RequestTechnicalProposalsComponent } from './components/technical-proposal-list/request-technical-proposals.component';
import { RequestCommercialProposalsComponent } from './components/commercial-proposal-list/request-commercial-proposals.component';
import { RequestAgreementsComponent } from './components/agreements/request-agreements.component';
import { AgreementsModule } from "../../agreements/agreements.module";
import { NewRequestModalComponent } from './components/request-create-modal/new-request-modal.component';


@NgModule({
  declarations: [
    CommercialProposalsComponent,
    CustomerRequestComponent,
    CustomerRequestListViewComponent,
    RequestPositionComponent,
    TechnicalProposalsComponent,
    RequestTechnicalProposalsComponent,
    RequestCommercialProposalsComponent,
    RequestAgreementsComponent,
    NewRequestModalComponent
  ],
  imports: [
    AgreementsModule,
    RequestCustomerRoutingModule,
    RequestCommonModule,
  ],
  providers: [
    CustomerRequestService,
    CustomerTechnicalProposalsService
  ]
})
export class RequestCustomerModule {
}
