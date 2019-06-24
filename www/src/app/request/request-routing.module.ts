import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RequestListComponent} from "./request-list/request-list.component";

const routes: Routes = [
  {
    path: 'customer',
    children: [
      {
        path: '',
        component: RequestListComponent
      }
    ]
  },
  {
    path: 'back-office',
    children: [
      {
        path: '',
        component: RequestListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {
}
