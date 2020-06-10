import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from "./auth/can-activate.guard";
import { AppAuthGuard } from "./auth/app-auth.guard";
import { AppComponent } from "./app.component";

const routes: Routes = [
  { path: '', canActivate: [CanActivateGuard], component: AppComponent },
  { path: '', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  { path: 'dashboard', canActivate: [AppAuthGuard], loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
  { path: 'requests', canActivate: [AppAuthGuard], loadChildren: () => import('./request/request.module').then(m => m.RequestModule)},
  { path: 'catalog', canActivate: [AppAuthGuard], loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)},
  { path: 'cart', canActivate: [AppAuthGuard], loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)},
  { path: 'contragents', canActivate: [AppAuthGuard], loadChildren: () => import('./contragent/contragent.module').then(m => m.ContragentModule)},
  { path: 'employees', canActivate: [AppAuthGuard], loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule)},
  { path: 'messages', canActivate: [AppAuthGuard], loadChildren: () => import('./message/message.module').then(m => m.MessageModule)},
  { path: 'notifications', canActivate: [AppAuthGuard], loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule)},
  { path: 'kim', canActivate: [AppAuthGuard], loadChildren: () => import('./kim/kim.module').then(m => m.KimModule)},
  { path: 'agreements', canActivate: [AppAuthGuard], loadChildren: () => import('./agreements/agreements.module').then(m => m.AgreementsModule)},
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [CanActivateGuard, AppAuthGuard]
})
export class AppRoutingModule {
}
