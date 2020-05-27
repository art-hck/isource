import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementsComponent } from "./customer/components/agreements/agreements.component";

const routes: Routes = [
  {
    path: 'customer',
    component: AgreementsComponent,
    data: { title: "Согласования" }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgreementsRoutingModule {
}
