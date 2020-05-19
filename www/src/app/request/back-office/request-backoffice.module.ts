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
import { CommercialProposalListComponent } from './components/commercial-proposal-list/commercial-proposal-list.component';
import { CommercialProposalFormComponent } from './components/commercial-proposal-form/commercial-proposal-form.component';
import { TechnicalProposalComponent } from "./components/technical-proposal/technical-proposal.component";
import { PositionService } from "./services/position.service";
import { TechnicalCommercialProposalListComponent } from './components/technical-commercial-proposal-list/technical-commercial-proposal-list.component';
import { TechnicalCommercialProposalFormComponent } from "./components/technical-commercial-proposal-form/technical-commercial-proposal-form.component";
import { TechnicalCommercialProposalService } from "./services/technical-commercial-proposal.service";
import { NgxsModule } from "@ngxs/store";
import { TechnicalCommercialProposalState } from "./states/technical-commercial-proposal.state";
import { TechnicalCommercialProposalFilterComponent } from "./components/technical-commercial-proposal-filter/technical-commercial-proposal-filter.component";
import { TechnicalCommercialProposalComponent } from "./components/technical-commercial-proposal/technical-commercial-proposal.component";
import { TechnicalCommercialProposalParametersFormComponent } from './components/technical-commercial-proposal-form/technical-commercial-proposal-parameters-form/technical-commercial-proposal-parameters-form.component';
import { RequestState } from "./states/request.state";
import { RequestListState } from "./states/request-list.state";
import { RequestList2Component } from './components/request-list2/request-list2.component';
import {CommercialProposalState} from "./states/commercial-proposal.state";
import { TechnicalCommercialProposalContragentFormComponent } from "./components/technical-commercial-proposal-list/contragent-form/contragent-form.component";
import { TechnicalCommercialProposalPositionFormComponent } from "./components/technical-commercial-proposal-list/proposal-position-form/proposal-position-form.component";
import { ProcedureComponent } from './components/procedure/procedure.component';

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
    TechnicalProposalComponent,
    CommercialProposalListComponent,
    CommercialProposalFormComponent,
    TechnicalCommercialProposalComponent,
    TechnicalCommercialProposalListComponent,
    TechnicalCommercialProposalFormComponent,
    TechnicalCommercialProposalFilterComponent,
    TechnicalCommercialProposalParametersFormComponent,
    RequestList2Component,
    TechnicalCommercialProposalContragentFormComponent,
    TechnicalCommercialProposalPositionFormComponent,
    ProcedureComponent,
  ],
  imports: [
    RequestBackofficeRoutingModule,
    NgxsModule.forFeature([
      RequestState,
      RequestListState,
      TechnicalCommercialProposalState,
      CommercialProposalState,
    ]),
    RequestCommonModule
  ],
  providers: [
    DesignDocumentationService,
    CommercialProposalsService,
    ProcedureService,
    RequestService,
    TechnicalProposalsService,
    PositionService,
    TechnicalCommercialProposalService,
  ]
})
export class RequestBackofficeModule {
}
