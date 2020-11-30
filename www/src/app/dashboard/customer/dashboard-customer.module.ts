import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from "../dashboard-routing.module";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';
import { DashboardStatisticComponent } from './components/dashboard-statistic/dashboard-statistic.component';
import { DashboardNotificationComponent } from './components/dashboard-notification/dashboard-notification.component';
import { SharedModule } from "../../shared/shared.module";
import { DashboardService } from "./services/dashboard.service";
import { DashboardMapService } from "./services/dashboard-map.service";
import { DashboardMapDirective } from './directive/dashboard-map.directive';
import { DashboardMapMarkerDirective } from "./directive/dashboard-map-marker.directive";
import { AgreementsCommonModule } from "../../agreements/common/agreements-common.module";
import { AgreementsService } from "../../agreements/customer/services/agreements.service";
import { DashboardCustomerRoutingModule } from "./dashboard-customer-routing.module";

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardMapComponent,
    DashboardStatisticComponent,
    DashboardNotificationComponent,
    DashboardMapDirective,
    DashboardMapMarkerDirective,
  ],
  imports: [
    AgreementsCommonModule,
    SharedModule,
    CommonModule,
    DashboardCustomerRoutingModule
  ],
  providers: [
    DashboardService,
    DashboardMapService,
    AgreementsService
  ],
})
export class DashboardCustomerModule {
}
