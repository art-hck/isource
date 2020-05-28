import { RouterModule, Routes } from "@angular/router";
import { CanActivateFeatureGuard } from "../core/can-activate-feature.guard";
import { NgModule } from "@angular/core";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ CanActivateFeatureGuard ],
    data: { title: "Главная", hideTitle: true, feature: 'dashboard' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
