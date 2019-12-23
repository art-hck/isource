import { NgModule } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AddFromExcelComponent } from './components/add-from-excel/add-from-excel.component';
import { ContractComponent } from "./components/contract/contract.component";
import { ContractCreateComponent } from "./components/contract-create-modal/contract-create.component";
import { ContractService } from "./services/contract.service";
import { ContractUploadDocumentComponent } from "./components/contract-upload-document/contract-upload-document.component";
import { CreateRequestComponent } from "./components/create-request/create-request.component";
import { CreateRequestFormComponent } from './components/create-request-form/create-request-form.component';
import { CreateRequestFreeFormComponent } from './components/create-request-free-form/create-request-free-form.component';
import { CustomerListNamesFilterComponent } from "./components/request-list/customer-list-names-filter/customer-list-names-filter.component";
import { DeliveryMonitorComponent } from './components/delivery-monitor/delivery-monitor.component';
import { DeliveryMonitorService } from "./services/delivery-monitor.service";
import { DesignDocumentationComponent } from "./components/design-documentation/design-documentation.component";
import { DigitalInspectorComponent } from "./components/delivery-monitor/digital-inspector/digital-inspector.component";
import { DocumentListComponent } from './components/document-list/document-list.component';
import { EditPositionInfoFormComponent } from './components/edit-position-info-form/edit-position-info-form.component';
import { GoodCardComponent } from './components/delivery-monitor/good-card/good-card.component';
import { GroupInfoComponent } from './components/group-info/group-info.component';
import { GroupService } from "./services/group.service";
import { MessagesComponent } from './components/messages/messages.component';
import { OffersComponent as BackofficeOffersComponent } from './components/offers/offers.component';
import { PieChartComponent } from './components/request/pie-chart/pie-chart.component';
import { PositionInfoComponent } from "./components/position-info/position-info.component";
import { PositionInfoHistoryComponent } from './components/position-info-history/position-info-history.component';
import { RequestAddGroupModalComponent } from "./components/request/request-add-group-modal/request-add-group-modal.component";
import { RequestAddResponsibleModalComponent } from './components/request/request-add-responsible-modal/request-add-responsible-modal.component';
import { RequestAsideInfoComponent } from "./components/request/request-aside-info/request-aside-info.component";
import { RequestComponent } from "./components/request/request.component";
import { RequestDashboardComponent } from './components/request-dashboard/request-dashboard.component';
import { RequestFilterCustomerListComponent } from './components/request-list/request-list-filter/request-filter-customer-list/request-filter-customer-list.component';
import { RequestInfoComponent } from "./components/request-info/request-info.component";
import { RequestListComponent } from "./components/request-list/request-list.component";
import { RequestTpFilterComponent } from "./components/request-technical-proposals/request-tp-filter/request-tp-filter.component";
import { RequestListFilterComponent } from './components/request-list/request-list-filter/request-list-filter.component';
import { RequestListFilterSectionComponent } from "./components/request-list/request-list-filter/request-list-filter-section/request-list-filter-section.component";
import { RequestListNumberFilterComponent } from "./components/request-list/request-list-number-filter/request-list-number-filter.component";
import { RequestListPositionStatusesFilterComponent } from "./components/request-list/request-list-position-statuses-filter/request-list-position-statuses-filter.component";
import { RequestListStatusesFilterComponent } from "./components/request-list/request-list-statuses-filter/request-list-statuses-filter.component";
import { RequestPositionComponent } from './components/request-position/request-position.component';
import { RequestPositionListComponent } from './components/request-position-list/request-position-list.component';
import { RequestPositionStatusService } from "./services/request-position-status.service";
import { RequestViewComponent } from "./components/request-view/request-view.component";

import { ContragentModule } from "../../contragent/contragent.module";
import { ContragentService } from "../../contragent/services/contragent.service";
import { PositionSearchFilterPipe } from "../../shared/pipes/position-list-filter-pipe";
import { SearchFilterPipe } from "../../shared/pipes/filter-pipe";
import { SharedModule } from "../../shared/shared.module";
import { UxgModule } from "uxg";
import { RequestPositionFormComponent } from "./components/request-position-form/request-position-form.component";
import { RequestTechnicalProposalsComponent } from "./components/request-technical-proposals/request-technical-proposals.component";

const RequestCommonModuleDeclarations = [
  AddFromExcelComponent,
  BackofficeOffersComponent,
  ContractComponent,
  ContractCreateComponent,
  ContractUploadDocumentComponent,
  CreateRequestComponent,
  CreateRequestFormComponent,
  CreateRequestFreeFormComponent,
  CustomerListNamesFilterComponent,
  DeliveryMonitorComponent,
  DesignDocumentationComponent,
  DigitalInspectorComponent,
  DocumentListComponent,
  EditPositionInfoFormComponent,
  GoodCardComponent,
  GroupInfoComponent,
  MessagesComponent,
  PieChartComponent,
  PositionInfoComponent,
  PositionInfoHistoryComponent,
  PositionSearchFilterPipe,
  RequestAddGroupModalComponent,
  RequestAddResponsibleModalComponent,
  RequestAsideInfoComponent,
  RequestComponent,
  RequestDashboardComponent,
  RequestFilterCustomerListComponent,
  RequestInfoComponent,
  RequestListComponent,
  RequestTpFilterComponent,
  RequestListFilterComponent,
  RequestListFilterSectionComponent,
  RequestListNumberFilterComponent,
  RequestListPositionStatusesFilterComponent,
  RequestListStatusesFilterComponent,
  RequestPositionComponent,
  RequestPositionFormComponent,
  RequestPositionListComponent,
  RequestTechnicalProposalsComponent,
  RequestViewComponent,
  SearchFilterPipe

];

@NgModule({
  declarations: RequestCommonModuleDeclarations,
  imports: [
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    TextMaskModule,
    ContragentModule,
    UxgModule
  ],
  providers: [
    GroupService,
    ContragentService,
    ContractService,
    RequestPositionStatusService,
    DeliveryMonitorService,
  ],
  exports: [
    SharedModule,
    ReactiveFormsModule,
    TextMaskModule,
    ContragentModule,
    ...RequestCommonModuleDeclarations
  ]
})
export class RequestCommonModule {
}
