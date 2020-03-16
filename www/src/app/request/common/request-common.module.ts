import { NgModule } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ContractListComponent } from "./components/contract-list/contract-list.component";
import { ContractCreateComponent } from "./components/contract-create/contract-create.component";
import { ContractService } from "./services/contract.service";
import { ContractListUploadDocumentComponent } from "./components/contract-list/contract-list-upload-document/contract-list-upload-document.component";
import { RequestFormComponent } from './components/request-form/request-form.component';
import { RequestFormFreeComponent } from './components/request-form-free/request-form-free.component';
import { DeliveryMonitorComponent } from './components/delivery-monitor/delivery-monitor.component';
import { DeliveryMonitorService } from "./services/delivery-monitor.service";
import { DesignDocumentationListComponent } from "./components/design-documentation-list/design-documentation-list.component";
import { DeliveryMonitorDigitalInspectorComponent } from "./components/delivery-monitor/delivery-monitor-digital-inspector/delivery-monitor-digital-inspector.component";
import { DeliveryMonitorGoodCardComponent } from './components/delivery-monitor/delivery-monitor-good-card/delivery-monitor-good-card.component';
import { GroupService } from "./services/group.service";
import { CommercialProposalListDeprecatedComponent as BackofficeOffersComponent } from './components/commercial-proposal-list-deprecated/commercial-proposal-list-deprecated.component';
import { RequestPieChartComponent } from './components/request/request-pie-chart/request-pie-chart.component';
import { PositionHistoryComponent } from './components/position/position-history/position-history.component';
import { RequestAddGroupModalComponent } from "./components/request/request-add-group-modal/request-add-group-modal.component";
import { RequestAddResponsibleModalComponent } from './components/request/request-add-responsible-modal/request-add-responsible-modal.component';
import { RequestAsideInfoComponent } from "./components/request/request-aside-info/request-aside-info.component";
import { RequestComponent } from "./components/request/request.component";
import { RequestFilterCustomerListComponent } from './components/request-list/request-list-filter/request-filter-customer-list/request-filter-customer-list.component';
import { RequestListComponent } from "./components/request-list/request-list.component";
import { TechnicalProposalFilterComponent } from "./components/technical-proposal-filter/technical-proposal-filter.component";
import { RequestListFilterComponent } from './components/request-list/request-list-filter/request-list-filter.component';
import { RequestListFilterSectionComponent } from "./components/request-list/request-list-filter/request-list-filter-section/request-list-filter-section.component";
import { PositionComponent } from './components/position/position.component';
import { RequestPositionStatusService } from "./services/request-position-status.service";

import { ContragentModule } from "../../contragent/contragent.module";
import { ContragentService } from "../../contragent/services/contragent.service";
import { PositionSearchFilterPipe } from "../../shared/pipes/position-list-filter-pipe";
import { SearchFilterPipe } from "../../shared/pipes/filter-pipe";
import { SharedModule } from "../../shared/shared.module";
import { PositionFormComponent } from "./components/position-form/position-form.component";
import { RequestTechnicalProposalComponent } from "./components/technical-proposal/technical-proposal.component";
import { CommercialProposalListComponent } from "./components/commercial-proposal-list/commercial-proposal-list.component";
import { RequestAddPositionModalComponent } from "./components/request/request-add-position-modal/request-add-position-modal.component";
import { TechnicalProposalFilterContragentListComponent } from "./components/technical-proposal-filter/technical-proposal-filter-contragent-list/technical-proposal-filter-contragent-list.component";
import { RequestTpFilterStatusesListComponent } from "./components/technical-proposal-filter/technical-proposal-filter-statuses-list/request-tp-filter-statuses-list.component";
import { RequestTpFilterSectionComponent } from "./components/technical-proposal-filter/technical-proposal-filter-section/request-tp-filter-section.component";
import { CommercialProposalListFilterComponent } from "./components/commercial-proposal-list/commercial-proposal-list-filter/commercial-proposal-list-filter.component";
import { PositionsStatusChangeComponent } from "../back-office/components/position-status-change/positions-status-change.component";
import { RequestMoveGroupModalComponent } from "./components/request/request-move-group-modal/request-move-group-modal.component";

const RequestCommonModuleDeclarations = [
  BackofficeOffersComponent,
  ContractListComponent,
  ContractCreateComponent,
  ContractListUploadDocumentComponent,
  RequestFormComponent,
  RequestFormFreeComponent,
  DeliveryMonitorComponent,
  DesignDocumentationListComponent,
  DeliveryMonitorDigitalInspectorComponent,
  DeliveryMonitorGoodCardComponent,
  RequestPieChartComponent,
  PositionHistoryComponent,
  PositionSearchFilterPipe,
  RequestAddGroupModalComponent,
  PositionsStatusChangeComponent,
  RequestAddResponsibleModalComponent,
  RequestAddPositionModalComponent,
  RequestAsideInfoComponent,
  RequestComponent,
  RequestFilterCustomerListComponent,
  TechnicalProposalFilterContragentListComponent,
  RequestTpFilterStatusesListComponent,
  RequestListComponent,
  CommercialProposalListFilterComponent,
  TechnicalProposalFilterComponent,
  RequestTpFilterSectionComponent,
  RequestListFilterComponent,
  RequestListFilterSectionComponent,
  PositionComponent,
  PositionFormComponent,
  RequestTechnicalProposalComponent,
  CommercialProposalListComponent,
  SearchFilterPipe,
  RequestMoveGroupModalComponent

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
