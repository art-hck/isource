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
import { TextMaskModule } from "angular2-text-mask";
import { ItemsDictionaryComponent } from './components/items-dictionary/items-dictionary.component';
import { ItemsDictionaryState } from "./states/items-dictionary.state";
import { KimItemsDictionaryService } from "./services/kim-items-dictionary.service";


@NgModule({
  declarations: [
    PriceOrderFormComponent,
    PriceOrderListComponent,
    CartComponent,
    CatalogComponent,
    PriceOrderFormPositionsComponent,
    PriceOrderFormPositionsParamsComponent,
    ItemsDictionaryComponent,
  ],
  providers: [
    KimPriceOrderService,
    KimItemsDictionaryService
  ],
  imports: [
    KimCommonModule,
    KimCustomerRoutingModule,
    NgxsModule.forFeature([
      PriceOrderState,
      ItemsDictionaryState
    ]),
    TextMaskModule
  ]
})
export class KimCustomerModule { }
