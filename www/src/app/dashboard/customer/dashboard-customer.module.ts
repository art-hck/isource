import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from "../../shared/shared.module";
import { DashboardService } from "./services/dashboard.service";
import { AgreementsCommonModule } from "../../agreements/common/agreements-common.module";
import { AgreementsService } from "../../agreements/customer/services/agreements.service";
import { DashboardCustomerRoutingModule } from "./dashboard-customer-routing.module";
import { DashboardCommonModule } from "../common/dashboard-common.module";
import { NgxsModule } from "@ngxs/store";
import { DashboardState } from "./states/dashboard.state";

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    AgreementsCommonModule,
    DashboardCommonModule,
    SharedModule,
    CommonModule,
    NgxsModule.forFeature([
      DashboardState
    ]),
    DashboardCustomerRoutingModule
  ],
  providers: [
    DashboardService,
    AgreementsService
  ],
})
export class DashboardCustomerModule {
}
