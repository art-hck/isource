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
  { path: 'messages', loadChildren: () => import('./message/message.module').then(m => m.MessageModule)},
  { path: 'guidlines', loadChildren: () => import('./ux-guidlines/ux-guidlines.module').then(m => m.UxGuidlinesModule)},
  { path: 'login', component: LoginComponent, data: { title: "Авторизация" }},
  { path: 'registration', component: RegistrationComponent, data: { title: "Регистрация" } },
  { path: '**', component: NotFoundComponent, data: { title: "404 - Страница не найдена" } }
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
