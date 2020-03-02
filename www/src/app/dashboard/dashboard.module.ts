import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';
import { DashboardStatisticComponent } from './components/dashboard-statistic/dashboard-statistic.component';
import { DashboardNotificationComponent } from './components/dashboard-notification/dashboard-notification.component';
import { SharedModule } from "../shared/shared.module";
import { AgreementsModule } from "../agreements/agreements.module";
import { DashboardService } from "./services/dashboard.service";

@NgModule({
  declarations: [DashboardComponent, DashboardMapComponent, DashboardStatisticComponent, DashboardNotificationComponent],
  imports: [
    AgreementsModule,
    SharedModule,
    CommonModule,
    DashboardRoutingModule
  ],
  providers: [
    DashboardService,
  ],
})
export class DashboardModule {
}
