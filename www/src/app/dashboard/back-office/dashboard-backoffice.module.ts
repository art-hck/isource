import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { AgreementsCommonModule } from "../../agreements/common/agreements-common.module";
import { DashboardBackofficeRoutingModule } from "./dashboard-backoffice-routing.module";
import { DashboardService } from "./services/dashboard.service";
import { NgxsModule } from "@ngxs/store";
import { DashboardState } from "./states/dashboard.state";
import { ReactiveFormsModule } from "@angular/forms";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DashboardCommonModule } from "../common/dashboard-common.module";
import { DashboardCommonState } from "../common/states/dashboard.state";

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    AgreementsCommonModule,
    DashboardCommonModule,
    SharedModule,
    CommonModule,
    DashboardBackofficeRoutingModule,
    NgxsModule.forFeature([
      DashboardState
    ]),
    ReactiveFormsModule,
  ],
  providers: [
    DashboardService
  ],
})
export class DashboardBackofficeModule {
}
