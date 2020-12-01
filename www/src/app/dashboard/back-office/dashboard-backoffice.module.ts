import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from "../../shared/shared.module";
import { AgreementsCommonModule } from "../../agreements/common/agreements-common.module";
import { DashboardBackofficeRoutingModule } from "./dashboard-backoffice-routing.module";
import { DashboardService } from "./services/dashboard.service";
import { NgxsModule } from "@ngxs/store";
import { TasksBarComponent } from './components/tasks-bar/tasks-bar.component';
import { DashboardState } from "./states/dashboard.state";

@NgModule({
  declarations: [
    DashboardComponent,
    TasksBarComponent,
  ],
  imports: [
    AgreementsCommonModule,
    SharedModule,
    CommonModule,
    DashboardBackofficeRoutingModule,
    NgxsModule.forFeature([
      DashboardState
    ]),
  ],
  providers: [
    DashboardService
  ],
})
export class DashboardBackofficeModule {
}
