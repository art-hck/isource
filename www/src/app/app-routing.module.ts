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
  { path: 'requests', loadChildren: () => import('./request/request.module').then(m => m.RequestModule)},
  { path: 'catalog', loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)},
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
