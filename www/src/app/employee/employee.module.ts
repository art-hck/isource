import { NgModule } from '@angular/core';
import { EmployeeRoutingModule } from './employee-routing.module';
import { CommonModule } from '@angular/common';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeListViewComponent } from "./components/employee-list-view/employee-list-view.component";
import { EmployeeService } from "./services/employee.service";
import { EmployeeCardComponent } from './components/employee-card/employee-card.component';
import { EmployeeCardRequestListComponent } from './components/employee-card/employee-card-request-list/employee-card-request-list.component';
import { EmployeeCardPositionListComponent } from './components/employee-card/employee-card-position-list/employee-card-position-list.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    EmployeeRoutingModule
  ],
  declarations: [
    EmployeeListViewComponent,
    EmployeeListComponent,
    EmployeeCardComponent,
    EmployeeCardRequestListComponent,
    EmployeeCardPositionListComponent
  ],
  providers: [
    EmployeeService,
  ],
  exports: [
    EmployeeCardComponent,
  ]
})
export class EmployeeModule { }
