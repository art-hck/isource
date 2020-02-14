import { NgModule } from '@angular/core';
import { RequestCommonModule } from "../common/request-common.module";
import { RequestBackofficeRoutingModule } from "./request-backoffice-routing.module";

import { AddOffersComponent } from "./components/add-offers/add-offers.component";
import { DesignDocumentationService } from "./services/design-documentation.service";
import { OffersService } from "./services/offers.service";
import { ProcedureService } from "./services/procedure.service";
import { RequestComponent } from './components/request/request.component';
import { RequestListViewComponent } from './components/request-list-view/request-list-view.component';
import { RequestPositionComponent } from "./components/request-position/request-position.component";
import { RequestService } from "./services/request.service";
import { SupplierSelectComponent } from './components/supplier-select/supplier-select.component';
import { TechnicalProposalsService } from "./services/technical-proposals.service";
import { WizardCreateProcedureComponent } from './components/wizard-create-procedure/wizard-create-procedure.component';
import { RequestTechnicalProposalsComponent } from './components/request-technical-proposals/request-technical-proposals.component';
import { RequestTechnicalProposalsCreateComponent } from './components/request-technical-proposals/request-technical-proposals-create/request-technical-proposals-create.component';
import { RequestTechnicalProposalsCreateManufacturerComponent } from './components/request-technical-proposals/request-technical-proposals-create-manufacturer/request-technical-proposals-create-manufacturer.component';
import { RequestProcedureCreateComponent } from './components/request-procedure-create/request-procedure-create.component';
import { RequestProcedureCreatePropertiesComponent } from './components/request-procedure-create/request-procedure-create-properties/request-procedure-create-properties.component';
import { RequestProcedureCreateDocumentsComponent } from "./components/request-procedure-create/request-procedure-create-documents/request-procedure-create-documents.component";
import { RequestCommercialProposalsComponent } from './components/request-commercial-proposals/request-commercial-proposals.component';
import { RequestCommercialProposalsCreateComponent } from './components/request-commercial-proposals/request-commercial-proposals-create/request-commercial-proposals-create.component';
import { RequestTechnicalProposalComponent } from "./components/request-technical-proposal/request-technical-proposal.component";

@NgModule({
  declarations: [
    AddOffersComponent,
    RequestComponent,
    RequestListViewComponent,
    SupplierSelectComponent,
    WizardCreateProcedureComponent,
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
    OffersService,
    ProcedureService,
    RequestService,
    SupplierSelectComponent,
    TechnicalProposalsService,
  ]
})
export class RequestBackofficeModule {
}
