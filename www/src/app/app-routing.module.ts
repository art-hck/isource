import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { PageComponent as CartPageComponent } from './cart/page/page.component';
import { PriceListComponent } from "./price-list/components/price-list/price-list.component";
import { AccessGuard } from 'stdlib-ng/dist/core';
import {RegistrationComponent} from "./registration/components/registration.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '', canActivateChild: [AccessGuard], children: [
      /**
       * Тут размещаются роуты, которые доступны на основании списка gui пришедших с бека
       * Каждый роут должен содеражать routeId. Пример:
       * {path: 'create', component: UserCreateComponent}, data: { routeId: 'users.create' }
       */
      {path: 'cart', component: CartPageComponent, data: {routeId: 'cart'}}
    ],
  },
  { path: 'dictionary', loadChildren: () => import('./dictionary/dictionary.module').then(m => m.DictionaryModule)},
  { path: 'orders', loadChildren: () => import('./order/order.module').then(m => m.OrderModule)},
  { path: 'purchases', loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule) },
  { path: 'products-catalog', loadChildren: () => import('./product-catalog/product-catalog.module').then(m => m.ProductCatalogModule)},
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'pricelist', component: PriceListComponent},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
