import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KimPriceOrderListComponent } from "./components/kim-price-order-list/kim-price-order-list.component";
import { Routes } from "../../core/models/routes";

const routes: Routes = [
  {
    path: "",
    // component: KimCatalogComponent,
    // data: { title: "Все товары портала" },
    redirectTo: "price-orders",
  },
  {
    path: "price-orders",
    component: KimPriceOrderListComponent,
    data: { title: "Мои ценовые запросы" }
  },
  // {
  //   path: "cart",
  //   component: KimCartComponent,
  //   data: { title: "Корзина торгового портала" }
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KimCustomerRoutingModule {
}
