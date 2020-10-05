import { NgModule } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DeliveryMonitorComponent } from './components/delivery-monitor/delivery-monitor.component';
import { DeliveryMonitorService } from "./services/delivery-monitor.service";
import { DesignDocumentationListComponent } from "./components/design-documentation-list/design-documentation-list.component";
import { DeliveryMonitorDigitalInspectorComponent } from "./components/delivery-monitor/delivery-monitor-digital-inspector/delivery-monitor-digital-inspector.component";
import { DeliveryMonitorGoodCardComponent } from './components/delivery-monitor/delivery-monitor-good-card/delivery-monitor-good-card.component';
import { CommercialProposalListDeprecatedComponent } from './components/commercial-proposal-list-deprecated/commercial-proposal-list-deprecated.component';
import { RequestPieChartComponent } from './components/request/request-pie-chart/request-pie-chart.component';
import { PositionHistoryComponent } from './components/position/position-history/position-history.component';
import { RequestGroupFormComponent } from "./components/request/request-add-group-modal/request-group-form.component";
import { RequestAddResponsibleComponent } from './components/request/request-add-responsible-modal/request-add-responsible.component';
import { RequestAsideInfoComponent } from "./components/request/request-aside-info/request-aside-info.component";
import { RequestComponent } from "./components/request/request.component";
import { FilterCustomersComponent } from './components/request-list/request-list-filter/filter-customers/filter-customers.component';
import { TechnicalProposalFilterComponent } from "./components/technical-proposal-filter/technical-proposal-filter.component";
import { RequestListFilterComponent } from './components/request-list/request-list-filter/request-list-filter.component';
import { FilterSectionComponent } from "./components/request-list/request-list-filter/filter-section/filter-section.component";
import { PositionComponent } from './components/position/position.component';
import { RequestPositionStatusService } from "./services/request-position-status.service";
import { PositionSearchFilterPipe } from "../../shared/pipes/position-list-filter-pipe";
import { SearchFilterPipe } from "../../shared/pipes/filter-pipe";
import { SharedModule } from "../../shared/shared.module";
import { PositionFormComponent } from "./components/position-form/position-form.component";
import { RequestTechnicalProposalComponent } from "./components/technical-proposal/technical-proposal.component";
import { RequestAddPositionModalComponent } from "./components/request/request-add-position-modal/request-add-position-modal.component";
import { TechnicalProposalFilterContragentListComponent } from "./components/technical-proposal-filter/technical-proposal-filter-contragent-list/technical-proposal-filter-contragent-list.component";
import { RequestTpFilterStatusesListComponent } from "./components/technical-proposal-filter/technical-proposal-filter-statuses-list/request-tp-filter-statuses-list.component";
import { RequestTpFilterSectionComponent } from "./components/technical-proposal-filter/technical-proposal-filter-section/request-tp-filter-section.component";
import { PositionsStatusChangeComponent } from "./components/position-status-change/positions-status-change.component";
import { RequestMoveGroupModalComponent } from "./components/request/request-move-group-modal/request-move-group-modal.component";
import { RequestPositionService } from "./services/request-position.service";
import { PositionCancelComponent } from "./components/position-cancel/position-cancel.component";
import { FilterPositionStatusesComponent } from "./components/request-list/request-list-filter/filter-position-statuses/filter-position-statuses.component";
import { RequestListComponent } from "./components/request-list/request-list.component";
import { TechnicalProposalsService } from "../back-office/services/technical-proposals.service";
import { ProcedureInfoComponent } from "./components/procedure-info/procedure-info.component";
import { TechnicalCommercialProposalGroupComponent } from "./components/technical-commercial-proposal-group/technical-commercial-proposal-group.component";
import { ContractListItemComponent } from "./components/contract-list-item/contract-list-item.component";

const RequestCommonModuleDeclarations = [
  CommercialProposalListDeprecatedComponent,
  DeliveryMonitorComponent,
  DesignDocumentationListComponent,
  DeliveryMonitorDigitalInspectorComponent,
  DeliveryMonitorGoodCardComponent,
  RequestPieChartComponent,
  PositionHistoryComponent,
  PositionSearchFilterPipe,
  RequestGroupFormComponent,
  PositionsStatusChangeComponent,
  RequestAddResponsibleComponent,
  RequestAddPositionModalComponent,
  RequestAsideInfoComponent,
  RequestComponent,
  FilterCustomersComponent,
  TechnicalProposalFilterContragentListComponent,
  RequestTpFilterStatusesListComponent,
  TechnicalProposalFilterComponent,
  RequestTpFilterSectionComponent,
  RequestListFilterComponent,
  FilterSectionComponent,
  PositionComponent,
  PositionFormComponent,
  RequestTechnicalProposalComponent,
  SearchFilterPipe,
  RequestMoveGroupModalComponent,
  PositionCancelComponent,
  FilterPositionStatusesComponent,
  RequestListComponent,
  ProcedureInfoComponent,
  TechnicalCommercialProposalGroupComponent,
  ContractListItemComponent
];

@NgModule({
  declarations: RequestCommonModuleDeclarations,
  imports: [
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    TextMaskModule,
  ],
  providers: [
    RequestPositionStatusService,
    TechnicalProposalsService,
    DeliveryMonitorService,
    RequestPositionService
  ],
  exports: [
    SharedModule,
    ReactiveFormsModule,
    TextMaskModule,
    ...RequestCommonModuleDeclarations
  ]
})
export class RequestCommonModule {
}
