import { NgModule } from '@angular/core';
import { KimPriceOrderFormComponent } from './components/kim-price-order-form/kim-price-order-form.component';
import { KimPriceOrderListComponent } from './components/kim-price-order-list/kim-price-order-list.component';
import { KimPriceOrderService } from "./services/kim-price-order.service";
import { KimCartComponent } from './components/kim-cart/kim-cart.component';
import { KimCatalogComponent } from './components/kim-catalog/kim-catalog.component';
import { KimRoutingModule } from "./kim-routing.module";
import { KimComponent } from './components/kim/kim.component';
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { NgxsModule } from "@ngxs/store";
import { KimPriceOrderState } from "./states/kim-price-order.state";

@NgModule({
  declarations: [
    KimPriceOrderFormComponent,
    KimPriceOrderListComponent,
    KimCartComponent,
    KimCatalogComponent,
    KimComponent
  ],
  providers: [
    KimPriceOrderService
  ],
  imports: [
    SharedModule,
    KimRoutingModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([
      KimPriceOrderState
    ])
  ]
})
export class KimModule { }
