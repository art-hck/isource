import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestListViewComponent as CustomerRequestsList } from "./customer/components/request-list-view/request-list-view.component";
import { RequestListViewComponent as BackofficeRequestsList } from "./back-office/components/request-list-view/request-list-view.component";
import { CreateRequestComponent } from "./common/components/create-request/create-request.component";
import { BackOfficeRequestViewComponent } from "./back-office/components/back-office-request-view/back-office-request-view.component";
import {CustomerRequestViewComponent} from "./customer/components/customer-request-view/customer-request-view.component";


const routes: Routes = [
  {
    path: 'customer',
    children: [
      {
        path: '',
        component: CustomerRequestsList
      },
      {
        path: ':id',
        component: CustomerRequestViewComponent
      }
    ]
  },
  {
    path: 'back-office',
    children: [
      {
        path: '',
        component: BackofficeRequestsList
      },
      {
        path: ':id',
        component: BackOfficeRequestViewComponent
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
