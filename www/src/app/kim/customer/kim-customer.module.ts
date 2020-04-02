import { NgModule } from '@angular/core';
import { NgxsModule } from "@ngxs/store";
import { PriceOrderState } from "./states/price-order.state";
import { KimCommonModule } from "../common/kim-common.module";
import { PriceOrderFormComponent } from "./components/price-order-form/price-order-form.component";
import { PriceOrderListComponent } from "./components/price-order-list/price-order-list.component";
import { CartComponent } from "./components/cart/cart.component";
import { CatalogComponent } from "./components/catalog/catalog.component";
import { KimPriceOrderService } from "./services/kim-price-order.service";
import { KimCustomerRoutingModule } from "./kim-customer-routing.module";
import { PriceOrderFormPositionsComponent } from './components/price-order-form/form-positions/form-positions.component';
import { PriceOrderFormPositionsParamsComponent } from './components/price-order-form/form-positions-params/form-positions-params.component';


@NgModule({
  declarations: [
    PriceOrderFormComponent,
    PriceOrderListComponent,
    CartComponent,
    CatalogComponent,
    PriceOrderFormPositionsComponent,
    PriceOrderFormPositionsParamsComponent,
  ],
  providers: [
    KimPriceOrderService
  ],
  imports: [
    KimCommonModule,
    KimCustomerRoutingModule,
    NgxsModule.forFeature([
      PriceOrderState
    ])
  ]
})
export class KimCustomerModule { }
