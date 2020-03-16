import { NgModule } from '@angular/core';
import { RequestCommonModule } from "../common/request-common.module";
import { RequestBackofficeRoutingModule } from "./request-backoffice-routing.module";

import { DesignDocumentationService } from "./services/design-documentation.service";
import { CommercialProposalsService } from "./services/commercial-proposals.service";
import { ProcedureService } from "./services/procedure.service";
import { RequestComponent } from './components/request/request.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { PositionComponent } from "./components/position/position.component";
import { RequestService } from "./services/request.service";
import { TechnicalProposalsService } from "./services/technical-proposals.service";
import { TechnicalProposalListComponent } from './components/technical-proposal-list/technical-proposal-list.component';
import { TechnicalProposalCreateComponent } from './components/technical-proposal-create/technical-proposal-create.component';
import { TechnicalProposalCreateManufacturerComponent } from './components/technical-proposal-create/technical-proposal-create-manufacturer/technical-proposal-create-manufacturer.component';
import { ProcedureCreateComponent } from './components/procedure-create/procedure-create.component';
import { ProcedureCreatePropertiesComponent } from './components/procedure-create/procedure-create-properties/procedure-create-properties.component';
import { ProcedureCreateDocumentsComponent } from "./components/procedure-create/procedure-create-documents/procedure-create-documents.component";
import { CommercialProposalListComponent } from './components/commercial-proposal-list/commercial-proposal-list.component';
import { CommercialProposalCreateComponent } from './components/commercial-proposal-create/commercial-proposal-create.component';
import { TechnicalProposalComponent } from "./components/technical-proposal/technical-proposal.component";
import { PositionService } from "./services/position.service";
import { TechnicalCommercialProposalListComponent } from './components/technical-commercial-proposal-list/technical-commercial-proposal-list.component';

@NgModule({
  declarations: [
    RequestComponent,
    RequestListComponent,
    PositionComponent,
    TechnicalProposalListComponent,
    TechnicalProposalCreateComponent,
    TechnicalProposalCreateManufacturerComponent,
    ProcedureCreateComponent,
    ProcedureCreatePropertiesComponent,
    ProcedureCreateDocumentsComponent,
    TechnicalProposalComponent,
    CommercialProposalListComponent,
    CommercialProposalCreateComponent,
    TechnicalCommercialProposalListComponent,
  ],
  imports: [
    RequestBackofficeRoutingModule,
    RequestCommonModule
  ],
  providers: [
    DesignDocumentationService,
    CommercialProposalsService,
    ProcedureService,
    RequestService,
    TechnicalProposalsService,
    PositionService
  ]
})
export class RequestBackofficeModule {
}
