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
import { DeliveryMonitorComponent } from './components/delivery-monitor/delivery-monitor.component';
import { DeliveryMonitorService } from "./services/delivery-monitor.service";
import { DesignDocumentationComponent } from "./components/design-documentation/design-documentation.component";
import { DigitalInspectorComponent } from "./components/delivery-monitor/digital-inspector/digital-inspector.component";
import { GoodCardComponent } from './components/delivery-monitor/good-card/good-card.component';
import { GroupService } from "./services/group.service";
import { MessagesComponent } from './components/messages/messages.component';
import { OffersComponent as BackofficeOffersComponent } from './components/offers/offers.component';
import { RequestPieChartComponent } from './components/request/request-pie-chart/request-pie-chart.component';
import { PositionInfoHistoryComponent } from './components/position-info-history/position-info-history.component';
import { RequestAddGroupModalComponent } from "./components/request/request-add-group-modal/request-add-group-modal.component";
import { RequestAddResponsibleModalComponent } from './components/request/request-add-responsible-modal/request-add-responsible-modal.component';
import { RequestAsideInfoComponent } from "./components/request/request-aside-info/request-aside-info.component";
import { RequestComponent } from "./components/request/request.component";
import { RequestFilterCustomerListComponent } from './components/request-list/request-list-filter/request-filter-customer-list/request-filter-customer-list.component';
import { RequestListComponent } from "./components/request-list/request-list.component";
import { RequestTpFilterComponent } from "./components/request-technical-proposal-filter/request-tp-filter.component";
import { RequestListFilterComponent } from './components/request-list/request-list-filter/request-list-filter.component';
import { RequestListFilterSectionComponent } from "./components/request-list/request-list-filter/request-list-filter-section/request-list-filter-section.component";
import { RequestPositionComponent } from './components/request-position/request-position.component';
import { RequestPositionStatusService } from "./services/request-position-status.service";

import { ContragentModule } from "../../contragent/contragent.module";
import { ContragentService } from "../../contragent/services/contragent.service";
import { PositionSearchFilterPipe } from "../../shared/pipes/position-list-filter-pipe";
import { SearchFilterPipe } from "../../shared/pipes/filter-pipe";
import { SharedModule } from "../../shared/shared.module";
import { RequestPositionFormComponent } from "./components/request-position-form/request-position-form.component";
import { RequestTechnicalProposalComponent } from "./components/request-technical-proposal/request-technical-proposals.component";
import { RequestCommercialProposalsComponent } from "./components/request-commercial-proposals/request-commercial-proposals.component";
import { RequestAddPositionModalComponent } from "./components/request/request-add-position-modal/request-add-position-modal.component";
import { RequestTpFilterContragentListComponent } from "./components/request-technical-proposal-filter/request-tp-filter-contragent-list/request-tp-filter-contragent-list.component";
import { RequestTpFilterStatusesListComponent } from "./components/request-technical-proposal-filter/request-tp-filter-statuses-list/request-tp-filter-statuses-list.component";
import { RequestTpFilterSectionComponent } from "./components/request-technical-proposal-filter/request-tp-filter-section/request-tp-filter-section.component";
import { RequestCpFilterComponent } from "./components/request-commercial-proposals/request-cp-filter/request-cp-filter.component";
import { PositionsStatusChangeComponent } from "../back-office/components/request/change-position-statuses/positions-status-change.component";

const RequestCommonModuleDeclarations = [
  AddFromExcelComponent,
  BackofficeOffersComponent,
  ContractComponent,
  ContractCreateComponent,
  ContractUploadDocumentComponent,
  CreateRequestComponent,
  CreateRequestFormComponent,
  CreateRequestFreeFormComponent,
  DeliveryMonitorComponent,
  DesignDocumentationComponent,
  DigitalInspectorComponent,
  GoodCardComponent,
  MessagesComponent,
  RequestPieChartComponent,
  PositionInfoHistoryComponent,
  PositionSearchFilterPipe,
  RequestAddGroupModalComponent,
  PositionsStatusChangeComponent,
  RequestAddResponsibleModalComponent,
  RequestAddPositionModalComponent,
  RequestAsideInfoComponent,
  RequestComponent,
  RequestFilterCustomerListComponent,
  RequestTpFilterContragentListComponent,
  RequestTpFilterStatusesListComponent,
  RequestListComponent,
  RequestCpFilterComponent,
  RequestTpFilterComponent,
  RequestTpFilterSectionComponent,
  RequestListFilterComponent,
  RequestListFilterSectionComponent,
  RequestPositionComponent,
  RequestPositionFormComponent,
  RequestTechnicalProposalComponent,
  RequestCommercialProposalsComponent,
  SearchFilterPipe

];

@NgModule({
  declarations: RequestCommonModuleDeclarations,
  imports: [
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    TextMaskModule,
    ContragentModule
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
