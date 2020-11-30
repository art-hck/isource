import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from "../dashboard-routing.module";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from "../../shared/shared.module";
import { AgreementsCommonModule } from "../../agreements/common/agreements-common.module";
import { AgreementsService } from "../../agreements/customer/services/agreements.service";
import { DashboardBackofficeRoutingModule } from "./dashboard-backoffice-routing.module";

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
    AgreementsService
  ],
})
export class DashboardBackofficeModule {
}
