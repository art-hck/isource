import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from "../../shared/shared.module";
import { AgreementsCommonModule } from "../../agreements/common/agreements-common.module";
import { AgreementsService } from "../../agreements/customer/services/agreements.service";
import { DashboardBackofficeRoutingModule } from "./dashboard-backoffice-routing.module";
import { DashboardService } from "./services/dashboard.service";

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    AgreementsCommonModule,
    SharedModule,
    CommonModule,
    DashboardBackofficeRoutingModule
  ],
  providers: [
    DashboardService,
    AgreementsService
  ],
})
export class DashboardBackofficeModule {
}
