import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { RegistrationComponent } from "./registration/components/registration.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'requests', loadChildren: () => import('./request/request.module').then(m => m.RequestModule)},
  { path: 'catalog', loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)},
  { path: 'cart', loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)},
  { path: 'contragents', loadChildren: () => import('./contragent/contragent.module').then(m => m.ContragentModule)},
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
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
