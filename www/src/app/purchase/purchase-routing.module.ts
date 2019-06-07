import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegistryComponent as CustomerRegistryComponent } from './components/customer/registry/registry.component';
import { RequirementViewComponent as CustomerRequirementViewComponent } from "./components/customer/requirement-view/requirement-view.component";
import { ProcedureViewComponent as CustomerProcedureViewComponent } from "./components/customer/procedure-view/procedure-view.component";
import { OrderViewComponent as CustomerOrderViewComponent } from "./components/customer/order-view/order-view.component";


import { RegistryComponent as SupplierRegistryComponent } from './components/supplier/registry/registry.component';
import { RequirementViewComponent as SupplierRequirementViewComponent } from './components/supplier/requirement-view/requirement-view.component';
import { ProcedureViewComponent as SupplierProcedureViewComponent } from "./components/supplier/procedure-view/procedure-view.component";
import { ReplacementItemsViewComponent as SupplierReplacementItemsViewComponent } from './components/supplier/replacement-items-view/replacement-items-view.component';
import { OrderViewComponent as SupplierOrderViewComponent } from "./components/supplier/order-view/order-view.component";

const routes: Routes = [
  {
    path: 'customer',
    children: [
      {
        path: 'list',
        component: CustomerRegistryComponent
      },
      {
        path: 'requirement/:id/view',
        component: CustomerRequirementViewComponent
      },
      {
        path: 'procedure/:id/view',
        component: CustomerProcedureViewComponent,
        data: { routeId: 'purchases/customer/procedure/view' }
      },
      {
        path: 'order/:id/view',
        component: CustomerOrderViewComponent,
        data: { routeId: 'purchases/customer/order/view' }
      },
      {
        path: '', redirectTo: 'list', pathMatch: 'full'
      },
    ]
  },
  {
    path: 'supplier',
    children: [
      {
        path: 'list',
        component: SupplierRegistryComponent
      },
      {
        path: 'requirement/:id/view',
        component: SupplierRequirementViewComponent
      },
      {
        path: 'procedure/:id/view',
        component: SupplierProcedureViewComponent,
        data: { routeId: 'purchases/customer/procedure/view' }
      },
      {
        path: 'order/:id/view',
        component: SupplierOrderViewComponent,
        data: { routeId: 'purchases/supplier/order/view' }
      },
      {
        path: ':id/requests-for-position-offer-change',
        component: SupplierReplacementItemsViewComponent
      },
      {
        path: '', redirectTo: 'list', pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule {
}
