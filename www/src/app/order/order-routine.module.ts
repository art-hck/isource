import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccessGuard } from '@stdlib-ng/core';
import { OrdersListComponent } from "./components/orders-list/orders-list.component";
import { SupplierOrdersListComponent } from "./components/supplier-orders-list/supplier-orders-list.component";
import { SupplierOrderConfirmationComponent } from "./components/supplier/supplier-order-confirmation/supplier-order-confirmation.component";
import { CustomerOrderConfirmationComponent } from "./components/customer/customer-order-confirmation/customer-order-confirmation.component";


const routes: Routes = [
  {
    path: '', canActivateChild: [AccessGuard], children: [
      /**
       * Тут размещаются роуты, которые доступны на основании списка gui пришедших с бека
       * Каждый роут должен содеражать routeId. Пример:
       * {path: 'create', component: UserCreateComponent}, data: { routeId: 'users.create' }
       */
      {
        path: 'my-orders',
        component: OrdersListComponent,
        data: {
          routeId: 'orders/my-orders'
        }
      },
      {
        path: 'incoming',
        component: SupplierOrdersListComponent,
        data: {
          routeId: 'orders/incoming'
        }
      },
      {
        path: 'supplier/:id/confirmation',
        component: SupplierOrderConfirmationComponent,
        data: {
          routeId: 'orders.supplier.confirmation'
        }
      },
      {
        path: 'customer/:id/confirmation',
        component: CustomerOrderConfirmationComponent,
        data: {
          routeId: 'orders.customer.confirmation'
        }
      }
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class OrderRoutineModule {

}
