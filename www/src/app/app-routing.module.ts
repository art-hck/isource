import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { ForbiddenComponent } from "./pages/forbidden/forbidden.component";
import { CanActivateGuard } from "./auth/can-activate.guard";

const routes: Routes = [
  { path: '',
    canActivate: [CanActivateGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
  { path: 'requests', loadChildren: () => import('./request/request.module').then(m => m.RequestModule)},
  { path: 'catalog', loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)},
  { path: 'cart', loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)},
  { path: 'contragents', loadChildren: () => import('./contragent/contragent.module').then(m => m.ContragentModule)},
  { path: 'employees', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule)},
  { path: 'messages', loadChildren: () => import('./message/message.module').then(m => m.MessageModule)},
  { path: 'notifications', loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule)},
  { path: 'not-found', component: NotFoundComponent, data: { title: "404 - Страница не найдена" } },
  { path: 'forbidden', component: ForbiddenComponent, data: { title: "403 - Доступ запрещен" } },
  { path: '**', redirectTo: '/not-found' }
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
