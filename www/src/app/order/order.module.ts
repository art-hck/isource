import { NgModule } from '@angular/core';
import { OrderRoutineModule } from "./order-routine.module";
import { OrdersListComponent } from "./components/orders-list/orders-list.component";
import { OrderParamRepresentation } from "./pipes/order-param-representation";
import { OrderPositionsCountPresentation } from "./pipes/order-positions-count-presentation";
import { OrdersStoreService } from "./services/orders-store.service";
import { SupplierOrderConfirmationComponent } from './components/supplier/supplier-order-confirmation/supplier-order-confirmation.component';
import { SupplierOrdersListComponent } from './components/supplier-orders-list/supplier-orders-list.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { OrdersFilterComponent } from './components/orders-filter/orders-filter.component';
import { OrdersPopularStatusesComponent } from './components/orders-popular-statuses/orders-popular-statuses.component';
import { DefaultPipe } from "./pipes/default-pipe";
import { CustomerOrderConfirmationComponent } from './components/customer/customer-order-confirmation/customer-order-confirmation.component';
import { OrderHeaderComponent } from './components/general/order-header/order-header.component';
import { OrderPositionsComponent } from './components/general/order-positions/order-positions.component';
import { OrderFinanceComponent } from './components/general/order-finance/order-finance.component';
import { OrderDeliveryComponent } from './components/general/order-delivery/order-delivery.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    OrderRoutineModule
  ],
  exports: [
    OrdersListComponent,
    OrderParamRepresentation,
    OrderPositionsCountPresentation,
    SupplierOrderConfirmationComponent,
    SupplierOrdersListComponent,
    PaginatorComponent,
    OrdersFilterComponent,
    OrdersPopularStatusesComponent,
    DefaultPipe
  ],
  declarations: [
    OrdersListComponent,
    OrderParamRepresentation,
    OrderPositionsCountPresentation,
    SupplierOrderConfirmationComponent,
    DefaultPipe,
    CustomerOrderConfirmationComponent,
    OrderHeaderComponent,
    OrderPositionsComponent,
    OrderFinanceComponent,
    OrderDeliveryComponent,
    SupplierOrdersListComponent,
    PaginatorComponent,
    OrdersFilterComponent,
    OrdersPopularStatusesComponent,
    DefaultPipe
  ],
  providers: [
    OrdersStoreService,
    OrderPositionsCountPresentation
  ]
})
export class OrderModule { }
