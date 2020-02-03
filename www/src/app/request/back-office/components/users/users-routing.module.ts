import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListViewComponent } from "./components/user-list-view/user-list-view.component";
import { UserCardComponent } from "./components/user-card/user-card.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: UserListViewComponent,
    data: { title: "Сотрудники" }
  },
  {
    path: ':id',
    children: [
      {
        path: 'info',
        component: UserCardComponent
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
