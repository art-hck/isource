import { NgModule } from '@angular/core';

import { SupplierComponent } from './components/supplier/supplier.component';
import { ItemComponent } from './components/item/item.component';
import { PageComponent } from './page/page.component';
import { WidgetComponent } from './widget/widget.component';
import { OrderComponent } from './components/order/order.component';
import { SumComponent } from './components/sum/sum.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    PageComponent,
    WidgetComponent,
    SupplierComponent,
    ItemComponent
  ],
  declarations: [
    PageComponent,
    WidgetComponent,
    SupplierComponent,
    ItemComponent,
    OrderComponent,
    SumComponent
  ]
})
export class CartModule { }
