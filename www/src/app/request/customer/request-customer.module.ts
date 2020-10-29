import { NgModule } from '@angular/core';
import { RequestCommonModule } from "../common/request-common.module";
import { RequestComponent } from './components/request/request.component';
import { RequestCustomerRoutingModule } from "./request-customer-routing.module";
import { RequestService } from "./services/request.service";
import { TechnicalProposalsService } from "./services/technical-proposals.service";
import { PositionComponent } from "./components/position/position.component";
import { RequestTechnicalProposalComponent } from './components/technical-proposal/technical-proposal.component';
import { TechnicalProposalListComponent } from './components/technical-proposal-list/technical-proposal-list.component';
import { CommercialProposalViewComponent } from './components/commercial-proposal-view/commercial-proposal-view.component';
import { AgreementsModule } from "../../agreements/agreements.module";
import { TechnicalCommercialProposalListComponent } from './components/technical-commercial-proposal-list/technical-commercial-proposal-list.component';
import { TechnicalCommercialProposalService } from "./services/technical-commercial-proposal.service";
import { NgxsModule } from "@ngxs/store";
import { TechnicalCommercialProposalState } from "./states/technical-commercial-proposal.state";
import { TechnicalCommercialProposalComponent } from "./components/technical-commercial-proposal/technical-commercial-proposal.component";
import { RequestFormComponent } from "./components/request-form/request-form.component";
import { RequestFormFreeComponent } from "./components/request-form-free/request-form-free.component";
import { RequestState } from "./states/request.state";
import { RequestListComponent } from "./components/request-list/request-list.component";
import { RequestListState } from "./states/request-list.state";
import { TechnicalProposalState } from "./states/technical-proposal.state";
import { CommercialProposalState } from "./states/commercial-proposal.state";
import { CommercialProposalListComponent } from "./components/commercial-proposal-list/commercial-proposal-list.component";
import { TechnicalCommercialProposalGroupViewComponent } from "./components/technical-commercial-proposal-group-view/technical-commercial-proposal-group-view.component";
import { ContractListComponent } from "./components/contract-list/contract-list.component";
import { ContractState } from "./states/contract.state";
import { ContractService } from "./services/contract.service";
import { TechnicalCommercialProposalConfirmComponent } from './components/technical-commercial-proposal-list/technical-commercial-proposal-confirm/technical-commercial-proposal-confirm.component';
import { CommercialProposalGroupViewComponent } from "./components/commercial-proposal-group-view/commercial-proposal-group-view.component";

@NgModule({
  declarations: [
    RequestComponent,
    RequestFormComponent,
    RequestFormFreeComponent,
    PositionComponent,
    RequestTechnicalProposalComponent,
    TechnicalProposalListComponent,
    CommercialProposalViewComponent,
    CommercialProposalGroupViewComponent,
    TechnicalCommercialProposalListComponent,
    TechnicalCommercialProposalComponent,
    RequestListComponent,
    CommercialProposalListComponent,
    TechnicalCommercialProposalGroupViewComponent,
    TechnicalCommercialProposalConfirmComponent,
    ContractListComponent
  ],
  imports: [
    AgreementsModule,
    RequestCustomerRoutingModule,
    RequestCommonModule,
    NgxsModule.forFeature([
      RequestState,
      RequestListState,
      TechnicalCommercialProposalState,
      TechnicalProposalState,
      CommercialProposalState,
      ContractState
    ]),
  ],
  providers: [
    RequestService,
    TechnicalProposalsService,
    TechnicalCommercialProposalService,
    ContractService
  ]
})
export class RequestCustomerModule {
}
