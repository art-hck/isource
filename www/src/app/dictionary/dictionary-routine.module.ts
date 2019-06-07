import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccessGuard } from 'stdlib-ng/dist/core';
import {SupplierDictionaryListComponent} from "./components/supplier/supplier-dictionary-list/supplier-dictionary-list.component";

const routes: Routes = [
  {
    path: '', canActivateChild: [AccessGuard], children: [
      /**
       * Тут размещаются роуты, которые доступны на основании списка gui пришедших с бека
       * Каждый роут должен содеражать routeId. Пример:
       * {path: 'create', component: UserCreateComponent}, data: { routeId: 'users.create' }
       */
      {
        path: 'supplier/list',
        component: SupplierDictionaryListComponent,
        data: {
          routeId: 'dictionary/supplier/list'
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
export class DictionaryRoutineModule {

}
