import { NgModule } from '@angular/core';
import { EmployeesRoutingModule } from './employees-routing.module';
import { CommonModule } from '@angular/common';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { SharedModule } from "../../../../shared/shared.module";
import { EmployeeListViewComponent } from "./components/employee-list-view/employee-list-view.component";
import { EmployeesService } from "./services/employees.service";
import { EmployeeCardComponent } from './components/employee-card/employee-card.component';
import { EmployeeCardViewComponent } from "./components/employee-card-view/employee-card-view.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    EmployeesRoutingModule
  ],
  declarations: [
    EmployeeListViewComponent,
    EmployeeListComponent,
    EmployeeCardComponent,
    EmployeeCardViewComponent
  ],
  providers: [
    EmployeesService,
  ],
  exports: [
    EmployeeCardComponent,
  ]
})
export class EmployeesModule { }
