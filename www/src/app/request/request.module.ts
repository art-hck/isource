import { NgModule } from '@angular/core';
import { RequestRoutingModule } from './request-routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { CreateRequestComponent } from "./common/components/create-request/create-request.component";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RequestListViewComponent as CustomerRequestListViewComponent } from './customer/components/request-list-view/request-list-view.component';
import { RequestListViewComponent as BackofficeRequestListViewComponent } from './back-office/components/request-list-view/request-list-view.component';
import { RequestService as BackofficeRequestService } from "./back-office/services/request.service";
import { RequestService as CustomerRequestService } from "./customer/services/request.service";
import { RequestListComponent } from "./common/components/request-list/request-list.component";
import { DocumentListComponent } from './common/components/document-list/document-list.component';
import { MessagesComponent } from './common/components/messages/messages.component';
import { CreateRequestFreeFormComponent } from './common/components/create-request-free-form/create-request-free-form.component';
import { OffersComponent as BackofficeOffersComponent } from './common/components/offers/offers.component';
import { OffersService as BackofficeOffersService } from "./back-office/services/offers.service";
import { TechnicalProposalsService as BackofficeTechnicalProposalsService } from "./back-office/services/technical-proposals.service";
import { TechnicalProposalsService as CustomerTechnicalProposalsService } from "./customer/services/technical-proposals.service";
import { AddFromExcelComponent } from './common/components/add-from-excel/add-from-excel.component';
import { RequestInfoComponent } from "./common/components/request-info/request-info.component";
import { PositionInfoComponent } from "./common/components/position-info/position-info.component";
import { BackOfficeRequestViewComponent } from './back-office/components/back-office-request-view/back-office-request-view.component';
import { RequestViewComponent } from "./common/components/request-view/request-view.component";
import { CustomerRequestViewComponent } from './customer/components/customer-request-view/customer-request-view.component';
import { EditPositionInfoFormComponent } from './common/components/edit-position-info-form/edit-position-info-form.component';
import { CreateRequestFormComponent } from './common/components/create-request-form/create-request-form.component';
import { RequestListStatusesFilterComponent } from "./common/components/request-list/request-list-statuses-filter/request-list-statuses-filter.component";
import { RequestListPositionStatusesFilterComponent } from "./common/components/request-list/request-list-position-statuses-filter/request-list-position-statuses-filter.component";
import { CustomerListNamesFilterComponent } from "./common/components/request-list/customer-list-names-filter/customer-list-names-filter.component";
import { RequestListNumberFilterComponent } from "./common/components/request-list/request-list-number-filter/request-list-number-filter.component";
import { ManufacturingComponent } from './common/components/manufacturing/manufacturing.component';
import { RequestPositionListComponent } from './common/components/request-position-list/request-position-list.component';
import { PositionInfoHistoryComponent } from './common/components/position-info-history/position-info-history.component';
import { GroupInfoComponent } from './common/components/group-info/group-info.component';
import { GroupService } from "./common/services/group.service";
import { AddOffersComponent } from "./back-office/components/add-offers/add-offers.component";
import { RequestDashboardComponent } from './common/components/request-dashboard/request-dashboard.component';
import { ContragentService } from "../contragent/services/contragent.service";
import { SearchFilterPipe } from "../shared/pipes/filter-pipe";
import { PositionSearchFilterPipe } from "../shared/pipes/position-list-filter-pipe";
import { CustomerSearchFilterPipe } from "../shared/pipes/customer-list-filter-pipe";
import { AddTechnicalProposalsComponent } from './back-office/components/add-technical-proposals/add-technical-proposals.component';
import { TechnicalProposalsComponent } from './customer/components/technical-proposals/technical-proposals.component';
import { SupplierSelectComponent } from './back-office/components/supplier-select/supplier-select.component';
import { CommercialProposalsComponent } from './customer/components/commercial-proposals/commercial-proposals.component';
import { ProcedureService } from "./back-office/services/procedure.service";
import { DesignDocumentationService } from "./back-office/services/design-documentation.service";
import { ContractService } from "./common/services/contract.service";
import { ContractCreateComponent } from "./common/components/contract-create-modal/contract-create.component";
import { ContractUploadDocumentComponent } from "./common/components/contract-upload-document/contract-upload-document.component";
import { DesignDocumentationComponent } from "./common/components/design-documentation/design-documentation.component";
import { ContractComponent } from "./common/components/contract/contract.component";
import { ContragentModule } from "../contragent/contragent.module";
import { RequestPositionStatusService } from "./common/services/request-position-status.service";
import { DeliveryMonitorComponent } from './common/components/delivery-monitor/delivery-monitor.component';
import { GoodCardComponent } from './common/components/delivery-monitor/good-card/good-card.component';
import { WizardCreateProcedureComponent } from './back-office/components/wizard-create-procedure/wizard-create-procedure.component';
import { DeliveryMonitorService } from "./common/services/delivery-monitor.service";
import { QualityComponent } from "./customer/components/quality/quality.component";
import { QualityService } from "./customer/services/quality.service";
import { DigitalInspectorComponent } from "./common/components/delivery-monitor/digital-inspector/digital-inspector.component";
import { RequestListFilterComponent } from './common/components/request-list/request-list-filter/request-list-filter.component';
import { RequestFilterCustomerListComponent } from './common/components/request-list/request-list-filter/request-filter-customer-list/request-filter-customer-list.component';
import { RequestListFilterSectionComponent } from "./common/components/request-list/request-list-filter/request-list-filter-section/request-list-filter-section.component";
import { RequestAddGroupModalComponent } from "./common/components/request/request-add-group-modal/request-add-group-modal.component";
import { RequestComponent } from "./common/components/request/request.component";
import { UxGuidlinesModule } from "../ux-guidlines/ux-guidlines.module";
import { RequestAsideInfoComponent } from "./common/components/request/request-aside-info/request-aside-info.component";

@NgModule({
  declarations: [
    RequestListComponent,
    CreateRequestComponent,
    CustomerRequestListViewComponent,
    BackofficeRequestListViewComponent,
    BackOfficeRequestViewComponent,
    DocumentListComponent,
    MessagesComponent,
    BackofficeOffersComponent,
    AddFromExcelComponent,
    CreateRequestFreeFormComponent,
    BackofficeOffersComponent,
    RequestInfoComponent,
    PositionInfoComponent,
    RequestViewComponent,
    CustomerRequestViewComponent,
    EditPositionInfoFormComponent,
    CreateRequestFormComponent,
    RequestListNumberFilterComponent,
    CustomerListNamesFilterComponent,
    RequestListStatusesFilterComponent,
    RequestListPositionStatusesFilterComponent,
    ManufacturingComponent,
    RequestPositionListComponent,
    PositionInfoHistoryComponent,
    GroupInfoComponent,
    AddOffersComponent,
    AddTechnicalProposalsComponent,
    RequestDashboardComponent,
    SearchFilterPipe,
    PositionSearchFilterPipe,
    CustomerSearchFilterPipe,
    TechnicalProposalsComponent,
    SupplierSelectComponent,
    SupplierSelectComponent,
    CommercialProposalsComponent,
    ContractComponent,
    DesignDocumentationComponent,
    ContractCreateComponent,
    ContractUploadDocumentComponent,
    DeliveryMonitorComponent,
    GoodCardComponent,
    WizardCreateProcedureComponent,
    QualityComponent,
    DigitalInspectorComponent,
    RequestListFilterComponent,
    RequestListFilterSectionComponent,
    RequestFilterCustomerListComponent,
    RequestComponent,
    RequestAsideInfoComponent,
    RequestAddGroupModalComponent
  ],
  imports: [
    SharedModule,
    RequestRoutingModule,
    ReactiveFormsModule,
    TextMaskModule,
    ContragentModule,
    UxGuidlinesModule
  ],
  providers: [
    BackofficeRequestService,
    CustomerRequestService,
    BackofficeOffersService,
    BackofficeTechnicalProposalsService,
    CustomerTechnicalProposalsService,
    GroupService,
    ContragentService,
    ProcedureService,
    SupplierSelectComponent,
    DesignDocumentationService,
    ContractService,
    RequestPositionStatusService,
    DeliveryMonitorService,
    QualityService
  ]
})
export class RequestModule {
}
