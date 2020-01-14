import { NgModule } from '@angular/core';
import { RequestCommonModule } from "../common/request-common.module";
import { RequestBackofficeRoutingModule } from "./request-backoffice-routing.module";

import { AddOffersComponent } from "./components/add-offers/add-offers.component";
import { AddTechnicalProposalsComponent } from './components/add-technical-proposals/add-technical-proposals.component';
import { BackOfficeRequestViewComponent } from './components/back-office-request-view/back-office-request-view.component';
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
import { RequestTechnicalProposalsCreatePositionsComponent } from './components/request-technical-proposals/request-technical-proposals-create-positions/request-technical-proposals-create-positions.component';
import { RequestTechnicalProposalsCreateManufacturerComponent } from './components/request-technical-proposals/request-technical-proposals-create-manufacturer/request-technical-proposals-create-manufacturer.component';
import { RequestCommercialProposalsComponent } from './components/request-commercial-proposals/request-commercial-proposals.component';

@NgModule({
  declarations: [
    AddOffersComponent,
    AddTechnicalProposalsComponent,
    BackOfficeRequestViewComponent,
    RequestComponent,
    RequestListViewComponent,
    SupplierSelectComponent,
    WizardCreateProcedureComponent,
    RequestPositionComponent,
    RequestTechnicalProposalsComponent,
    RequestTechnicalProposalsCreateComponent,
    RequestTechnicalProposalsCreatePositionsComponent,
    RequestTechnicalProposalsCreateManufacturerComponent,
    RequestCommercialProposalsComponent

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
