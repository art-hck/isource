import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardMapComponent } from './components/dashboard-map/dashboard-map.component';
import { DashboardStatisticComponent } from './components/dashboard-statistic/dashboard-statistic.component';
import { DashboardNotificationComponent } from './components/dashboard-notification/dashboard-notification.component';
import { DashboardApprovalComponent } from './components/dashboard-approval/dashboard-approval.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [DashboardComponent, DashboardMapComponent, DashboardStatisticComponent, DashboardNotificationComponent, DashboardApprovalComponent],
  imports: [
    SharedModule,
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
