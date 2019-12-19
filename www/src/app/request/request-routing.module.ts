import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRequestComponent } from "./common/components/create-request/create-request.component";

const routes: Routes = [
  {
    path: 'create',
    component: CreateRequestComponent,
    data: { title: "Индивидуальная заявка" }
  },
  { path: 'customer', loadChildren: () => import('./customer/request-customer.module').then(m => m.RequestCustomerModule) },
  { path: 'backoffice', loadChildren: () => import('./back-office/request-backoffice.module').then(m => m.RequestBackofficeModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {
}
