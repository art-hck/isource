import { NgModule } from '@angular/core';
import { RequestCommonModule } from "../common/request-common.module";
import { RequestBackofficeRoutingModule } from "./request-backoffice-routing.module";

import { DesignDocumentationService } from "./services/design-documentation.service";
import { CommercialProposalsService } from "./services/commercial-proposals.service";
import { ProcedureService } from "./services/procedure.service";
import { RequestComponent } from './components/request/request.component';
import { PositionComponent } from "./components/position/position.component";
import { RequestService } from "./services/request.service";
import { TechnicalProposalsService } from "./services/technical-proposals.service";
import { TechnicalProposalListComponent } from './components/technical-proposal-list/technical-proposal-list.component';
import { TechnicalProposalFormComponent } from './components/technical-proposal-form/technical-proposal-form.component';
import { ProposalFormManufacturerComponent } from './components/proposal-form-manufacturer/proposal-form-manufacturer.component';
import { ProcedureFormComponent } from './components/procedure-form/procedure-form.component';
import { ProcedureFormPropertiesComponent } from './components/procedure-form/procedure-form-properties/procedure-form-properties.component';
import { ProcedureFormDocumentsComponent } from "./components/procedure-form/procedure-form-documents/procedure-form-documents.component";
import { TechnicalProposalComponent } from "./components/technical-proposal/technical-proposal.component";
import { PositionService } from "./services/position.service";
import { TechnicalCommercialProposalViewComponent } from './components/proposal-view/technical-commercial-proposal-view/technical-commercial-proposal-view.component';
import { ProposalFormComponent } from "./components/proposal-form/proposal-form.component";
import { TechnicalCommercialProposalService } from "./services/technical-commercial-proposal.service";
import { NgxsModule } from "@ngxs/store";
import { TechnicalCommercialProposalState } from "./states/technical-commercial-proposal.state";
import { TechnicalCommercialProposalComponent } from "./components/technical-commercial-proposal/technical-commercial-proposal.component";
import { ProposalParametersFormComponent } from './components/proposal-form/proposal-parameters-form/proposal-parameters-form.component';
import { RequestState } from "./states/request.state";
import { RequestListState } from "./states/request-list.state";
import { RequestListComponent } from './components/request-list/request-list.component';
import { CommercialProposalState } from "./states/commercial-proposal.state";
import { ProposalContragentFormComponent } from "./components/proposal-contragent-form/proposal-contragent-form.component";
import { ProcedureComponent } from './components/procedure/procedure.component';
import { ProcedureGridComponent } from './components/procedure-grid/procedure-grid.component';
import { CommercialProposalViewComponent } from "./components/proposal-view/commercial-proposal-view/commercial-proposal-view.component";
import { ProcedureProlongateComponent } from "./components/procedure-prolongate/procedure-prolongate.component";
import { ProcedureViewComponent } from './components/procedure-view/procedure-view.component';
import { TechnicalCommercialProposalGroupListComponent } from './components/proposal-group-list/technical-commercial-proposal-group-list/technical-commercial-proposal-group-list.component';
import { ContractFormComponent } from "./components/contract-form/contract-form.component";
import { ContractListComponent } from "./components/contract-list/contract-list.component";
import { ContractState } from "./states/contract.state";
import { ContractService } from "./services/contract.service";
import { CommercialProposalComponent } from './components/commercial-proposal/commercial-proposal.component';
import { CommercialProposalGroupListComponent } from "./components/proposal-group-list/commercial-proposal-group-list/commercial-proposal-group-list.component";
import { ProposalGroupFormComponent } from "./components/proposal-group-form/proposal-group-form.component";
import { ProposalGroupListComponent } from './components/proposal-group-list/proposal-group-list.component';
import { ProposalItemFormComponent } from './components/proposal-item-form/proposal-item-form.component';
import { TechnicalCommercialProposalGroupService } from "./services/technical-commercial-proposal-group.service";
import { ProposalViewComponent } from "./components/proposal-view/proposal-view.component";
import { CommercialProposalGroupService } from "./services/commercial-proposal-group.service";
import { CommercialProposalsDeprecatedService } from "./services/commercial-proposals-deprecated.service";

@NgModule({
  declarations: [
    RequestComponent,
    PositionComponent,
    TechnicalProposalListComponent,
    TechnicalProposalFormComponent,
    ProposalFormManufacturerComponent,
    ProcedureFormComponent,
    ProcedureFormPropertiesComponent,
    ProcedureFormDocumentsComponent,
    ProcedureProlongateComponent,
    TechnicalProposalComponent,
    CommercialProposalViewComponent,
    CommercialProposalGroupListComponent,
    ProposalGroupFormComponent,
    ProposalViewComponent,
    TechnicalCommercialProposalComponent,
    TechnicalCommercialProposalViewComponent,
    ProposalFormComponent,
    ProposalParametersFormComponent,
    RequestListComponent,
    ProposalContragentFormComponent,
    ProcedureComponent,
    ProcedureGridComponent,
    ProcedureViewComponent,
    TechnicalCommercialProposalGroupListComponent,
    ContractFormComponent,
    ContractListComponent,
    CommercialProposalComponent,
    ProposalGroupListComponent,
    ProposalItemFormComponent,
  ],
  imports: [
    RequestBackofficeRoutingModule,
    NgxsModule.forFeature([
      RequestState,
      RequestListState,
      TechnicalCommercialProposalState,
      CommercialProposalState,
      ContractState
    ]),
    RequestCommonModule
  ],
  exports: [
    ProcedureFormComponent,
    ProcedureProlongateComponent
  ],
  providers: [
    DesignDocumentationService,
    CommercialProposalsService,
    CommercialProposalsDeprecatedService,
    CommercialProposalGroupService,
    ProcedureService,
    RequestService,
    TechnicalProposalsService,
    PositionService,
    TechnicalCommercialProposalService,
    TechnicalCommercialProposalGroupService,
    ContractService
  ]
})
export class RequestBackofficeModule {
}
