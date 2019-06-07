import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AccessGuard } from 'stdlib-ng/dist/core';
import { ProductCatalogComponent } from "./page/product-catalog.component";

const routes: Routes = [
  {
    path: '', canActivateChild: [AccessGuard], children: [
      /**
       * Тут размещаются роуты, которые доступны на основании списка gui пришедших с бека
       * Каждый роут должен содержать routeId. Пример:
       * {path: 'create', component: UserCreateComponent}, data: { routeId: 'users.create' }
       */

      {
        path: 'rosatom/list',
        component: ProductCatalogComponent,
        data: {
          routeId: 'products-catalog/rosatom/list',
          catalogCode: 'rosatom'
        }
      },
      {
        path: 'etp/list',
        component: ProductCatalogComponent,
        data: {
          routeId: 'products-catalog/etp/list',
          catalogCode: 'etp'
        }
      }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ProductCatalogRoutineModule {

}
