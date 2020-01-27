import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListViewComponent } from "./components/employee-list-view/employee-list-view.component";
import { EmployeeCardViewComponent } from "./components/employee-card-view/employee-card-view.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: EmployeeListViewComponent,
    data: { title: "Сотрудники" }
  },
  {
    path: ':id',
    children: [
      {
        path: 'info',
        component: EmployeeCardViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule {
}
