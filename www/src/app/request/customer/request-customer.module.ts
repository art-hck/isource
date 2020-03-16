import { NgModule } from '@angular/core';
import { CommercialProposalListOldComponent } from './components/commercial-proposal-list-old/commercial-proposal-list-old.component';
import { RequestCommonModule } from "../common/request-common.module";
import { RequestComponent as CustomerRequestComponent } from './components/request/request.component';
import { RequestCustomerRoutingModule } from "./request-customer-routing.module";
import { RequestListComponent as CustomerRequestListViewComponent } from './components/request-list/request-list.component';
import { RequestService as CustomerRequestService } from "./services/request.service";
import { TechnicalProposalListDeprecatedComponent } from './components/technical-proposal-list-deprecated/technical-proposal-list-deprecated.component';
import { TechnicalProposalsService as CustomerTechnicalProposalsService } from "./services/technical-proposals.service";
import { PositionComponent } from "./components/position/position.component";
import { TechnicalProposalListComponent } from './components/technical-proposal-list/technical-proposal-list.component';
import { CommercialProposalListComponent } from './components/commercial-proposal-list/commercial-proposal-list.component';
import { AgreementsComponent } from './components/agreements/agreements.component';
import { AgreementsModule } from "../../agreements/agreements.module";
import { RequestCreateModalComponent } from './components/request-create-modal/request-create-modal.component';


@NgModule({
  declarations: [
    CommercialProposalListOldComponent,
    CustomerRequestComponent,
    CustomerRequestListViewComponent,
    PositionComponent,
    TechnicalProposalListDeprecatedComponent,
    TechnicalProposalListComponent,
    CommercialProposalListComponent,
    AgreementsComponent,
    RequestCreateModalComponent
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
