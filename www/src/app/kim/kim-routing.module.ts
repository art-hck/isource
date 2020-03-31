import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KimPriceOrderListComponent } from "./components/kim-price-order-list/kim-price-order-list.component";
import { KimCatalogComponent } from "./components/kim-catalog/kim-catalog.component";
import { KimCartComponent } from "./components/kim-cart/kim-cart.component";
import { CanActivateFeatureGuard } from "../core/can-activate-feature.guard";
import { Routes } from "../core/models/routes";
import { KimComponent } from "./components/kim/kim.component";

const routes: Routes = [{
  path: "",
  component: KimComponent,
  canActivate: [CanActivateFeatureGuard],
  // outlet: "kim",
  data: { feature: "kim" },
  children: [
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
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KimRoutingModule {
}
