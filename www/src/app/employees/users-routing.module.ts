import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListViewComponent } from "./components/user-list-view/user-list-view.component";
import { UserCardComponent } from "./components/user-card/user-card.component";
import { CanActivateFeatureGuard } from "../core/can-activate-feature.guard";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'employees',
  },
  {
    path: 'employees',
    component: UserListViewComponent,
    canActivate: [CanActivateFeatureGuard],
    data: { title: "Сотрудники" }
  },
  {
    path: ':id',
    children: [
      {
        path: 'info',
        component: UserCardComponent,
        canActivate: [CanActivateFeatureGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
