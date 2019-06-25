import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RequestListViewComponent as CustomerRequestList } from "./customer/request-list-view/request-list-view.component";
import {RequestListViewComponent as BackofficeRequestList  } from "./backoffice/request-list-view/request-list-view.component";
import {CreateRequestComponent} from "./common/components/create-request/create-request.component";

const routes: Routes = [
  {
    path: 'customer',
    children: [
      {
        path: '',
        component: CustomerRequestList
      }
    ]
  },
  {
    path: 'back-office',
    children: [
      {
        path: '',
        component: BackofficeRequestList
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
