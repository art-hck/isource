import { NgModule } from '@angular/core';
import { CommercialProposalListOldComponent } from './components/commercial-proposal-list-old/commercial-proposal-list-old.component';
import { RequestCommonModule } from "../common/request-common.module";
import { RequestComponent } from './components/request/request.component';
import { RequestCustomerRoutingModule } from "./request-customer-routing.module";
import { RequestListComponent } from './components/request-list/request-list.component';
import { RequestService } from "./services/request.service";
import { TechnicalProposalListDeprecatedComponent } from './components/technical-proposal-list-deprecated/technical-proposal-list-deprecated.component';
import { TechnicalProposalsService } from "./services/technical-proposals.service";
import { PositionComponent } from "./components/position/position.component";
import { TechnicalProposalListComponent } from './components/technical-proposal-list/technical-proposal-list.component';
import { CommercialProposalListComponent } from './components/commercial-proposal-list/commercial-proposal-list.component';
import { AgreementsComponent } from './components/agreements/agreements.component';
import { AgreementsModule } from "../../agreements/agreements.module";
import { RequestCreateModalComponent } from './components/request-create-modal/request-create-modal.component';
import { TechnicalCommercialProposalListComponent } from './components/technical-commercial-proposal-list/technical-commercial-proposal-list.component';
import { TechnicalCommercialProposalService } from "./services/technical-commercial-proposal.service";
import { NgxsModule } from "@ngxs/store";
import { TechnicalCommercialProposalState } from "./states/technical-commercial-proposal.state";
import { TechnicalCommercialProposalComponent } from "./components/technical-commercial-proposal/technical-commercial-proposal.component";
import { RequestFormComponent } from "./components/request-form/request-form.component";
import { RequestFormFreeComponent } from "./components/request-form-free/request-form-free.component";


@NgModule({
  declarations: [
    CommercialProposalListOldComponent,
    RequestComponent,
    RequestFormComponent,
    RequestFormFreeComponent,
    RequestListComponent,
    PositionComponent,
    TechnicalProposalListDeprecatedComponent,
    TechnicalProposalListComponent,
    CommercialProposalListComponent,
    AgreementsComponent,
    RequestCreateModalComponent,
    TechnicalCommercialProposalListComponent,
    TechnicalCommercialProposalComponent,
  ],
  imports: [
    AgreementsModule,
    RequestCustomerRoutingModule,
    RequestCommonModule,
    NgxsModule.forFeature([
      TechnicalCommercialProposalState
    ]),
  ],
  providers: [
    RequestService,
    TechnicalProposalsService,
    TechnicalCommercialProposalService
  ]
})
export class RequestCustomerModule {
}
