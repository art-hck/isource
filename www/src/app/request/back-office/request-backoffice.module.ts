import { NgModule } from '@angular/core';
import { RequestCommonModule } from "../common/request-common.module";
import { RequestBackofficeRoutingModule } from "./request-backoffice-routing.module";

import { DesignDocumentationService } from "./services/design-documentation.service";
import { CommercialProposalsService } from "./services/commercial-proposals.service";
import { ProcedureService } from "./services/procedure.service";
import { RequestComponent } from './components/request/request.component';
import { RequestListViewComponent } from './components/request-list-view/request-list-view.component';
import { RequestPositionComponent } from "./components/position/request-position.component";
import { RequestService } from "./services/request.service";
import { TechnicalProposalsService } from "./services/technical-proposals.service";
import { RequestTechnicalProposalsComponent } from './components/technical-proposal-list/request-technical-proposals.component';
import { RequestTechnicalProposalsCreateComponent } from './components/technical-proposal-list/technical-proposal-list-create/request-technical-proposals-create.component';
import { RequestTechnicalProposalsCreateManufacturerComponent } from './components/technical-proposal-list/technical-proposal-list-create-manufacturer/request-technical-proposals-create-manufacturer.component';
import { RequestProcedureCreateComponent } from './components/procedure-create/request-procedure-create.component';
import { RequestProcedureCreatePropertiesComponent } from './components/procedure-create/procedure-create-properties/request-procedure-create-properties.component';
import { RequestProcedureCreateDocumentsComponent } from "./components/procedure-create/procedure-create-documents/request-procedure-create-documents.component";
import { RequestCommercialProposalsComponent } from './components/commercial-proposal-list/request-commercial-proposals.component';
import { RequestCommercialProposalsCreateComponent } from './components/commercial-proposal-create/request-commercial-proposals-create.component';
import { RequestTechnicalProposalComponent } from "./components/technical-proposal/request-technical-proposal.component";
import { RequestPositionChangeStatusService } from "./services/request-position-change-status.service";

@NgModule({
  declarations: [
    RequestComponent,
    RequestListViewComponent,
    RequestPositionComponent,
    RequestTechnicalProposalsComponent,
    RequestTechnicalProposalsCreateComponent,
    RequestTechnicalProposalsCreateManufacturerComponent,
    RequestProcedureCreateComponent,
    RequestProcedureCreatePropertiesComponent,
    RequestProcedureCreateDocumentsComponent,
    RequestTechnicalProposalComponent,
    RequestCommercialProposalsComponent,
    RequestCommercialProposalsCreateComponent
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
    RequestPositionChangeStatusService
  ]
})
export class RequestBackofficeModule {
}
