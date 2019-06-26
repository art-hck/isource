import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RequestListComponent} from "./request-list/request-list.component";
import {CreateRequestComponent} from "./common/components/create-request/create-request.component";
import {RequestViewComponent as BackofficeRequestViewComponent} from "./back-office/components/request-view/request-view.component";
import {RequestViewComponent as CustomerRequestViewComponent} from "./customer/components/request-view/request-view.component";

const routes: Routes = [
  {
    path: 'customer',
    children: [
      {
        path: '',
        component: RequestListComponent
      },
      {
        path: ':id/view',
        component: CustomerRequestViewComponent
      }
    ]
  },
  {
    path: 'back-office',
    children: [
      {
        path: '',
        component: RequestListComponent
      },
      {
        path: ':id/view',
        component: BackofficeRequestViewComponent
      }
    ]
  },
  {
    path: 'create',
    component: CreateRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {
}
