import { NgModule } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { PurchasesCustomerStoreService } from './services/purchases-customer-store.service';
import { PurchasesSupplierStoreService } from './services/purchases-supplier-store.service';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { RegistryComponent as CustomerRegistryComponent } from './components/customer/registry/registry.component';
import { RequirementViewComponent as CustomerRequirementViewComponent } from "./components/customer/requirement-view/requirement-view.component";
import { ProcedureViewComponent as CustomerProcedureViewComponent } from './components/customer/procedure-view/procedure-view.component';
import { RequirementViewComponent as SupplierPurchaseViewComponent } from './components/supplier/requirement-view/requirement-view.component';
import { OrderViewComponent as CustomerOrderViewComponent } from './components/customer/order-view/order-view.component';
import { OrderViewComponent as SupplierOrderViewComponent } from './components/supplier/order-view/order-view.component';
import { RegistryComponent as SupplierRegistryComponent } from './components/supplier/registry/registry.component';
import { PurchaseFilterComponent } from './components/common/purchase-filter/purchase-filter.component';
import { PurchaseTypeSelectorComponent } from './components/common/purchase-type-selector/purchase-type-selector.component';
import { LinkedItemsViewComponent } from './components/supplier/linked-items-view/linked-items-view.component';
import { EmptyLinkedItemsViewComponent } from './components/supplier/empty-linked-items-view/empty-linked-items-view.component';
import { SelectProductComponent } from './components/supplier/select-product/select-product.component';
import { AlertReplacementRequestComponent } from './components/supplier/alert-replacement-request/alert-replacement-request.component';
import { ReplacementItemsViewComponent as SupplierReplacementItemsViewComponent } from './components/supplier/replacement-items-view/replacement-items-view.component';
import { PurchasesSupplierReplacementsStoreService } from './services/purchases-supplier-replacements-store.service';
import { ReplacementItemViewComponent } from './components/common/replacement-item-view/replacement-item-view.component';
import { DocumentsListComponent } from './components/common/documents-list/documents-list.component';
import { PurchaseViewHeaderComponent } from './components/common/purchase-view-header/purchase-view-header.component';
import { OffersComponent } from './components/customer/offers/offers.component';
import { PositionsComponent as CustomerPositionsComponent } from './components/customer/positions/positions.component';
import { PositionsComponent as SupplierPositionsComponent } from './components/supplier/positions/positions.component';
import { NoticeComponent } from './components/common/notice/notice.component';
import { ProtocolsComponent } from './components/common/protocols/protocols.component';
import { ProcedureViewComponent } from './components/supplier/procedure-view/procedure-view.component';
import { RequirementPositionsComponent } from './components/supplier/requirement-positions/requirement-positions.component';
import { DatetimeSelectorModalComponent } from './components/customer/datetime-selector-modal/datetime-selector-modal.component';
import { SupplierProcedureStoreService } from './services/supplier-procedure-store.service';
import { ProcedureOfferCostComponent } from './components/supplier/procedure-offer-cost/procedure-offer-cost.component';
import { ProcedureWinnerComponent } from './components/customer/procedure-winner/procedure-winner.component';
import { FileUploadModule } from "ng2-file-upload";
import { OrderPriceComponent } from './components/common/order-price/order-price.component';
import { OrderPositionsComponent } from './components/common/order-positions/order-positions.component';
import { OrderSupplierComponent } from './components/customer/order-supplier/order-supplier.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    PurchaseRoutingModule,
    TextMaskModule,
    FileUploadModule
  ],
  declarations: [
    CustomerRegistryComponent,
    CustomerRequirementViewComponent,
    CustomerProcedureViewComponent,
    SupplierRegistryComponent,
    PurchaseFilterComponent,
    PurchaseTypeSelectorComponent,
    SupplierPurchaseViewComponent,
    CustomerOrderViewComponent,
    SupplierOrderViewComponent,
    LinkedItemsViewComponent,
    EmptyLinkedItemsViewComponent,
    SelectProductComponent,
    AlertReplacementRequestComponent,
    SupplierReplacementItemsViewComponent,
    ReplacementItemViewComponent,
    DocumentsListComponent,
    PurchaseViewHeaderComponent,
    OffersComponent,
    CustomerPositionsComponent,
    SupplierPositionsComponent,
    NoticeComponent,
    ProtocolsComponent,
    ProcedureViewComponent,
    RequirementPositionsComponent,
    DatetimeSelectorModalComponent,
    ProcedureOfferCostComponent,
    ProcedureWinnerComponent,
    OrderSupplierComponent,
    OrderPriceComponent,
    OrderPositionsComponent
  ],
  providers: [
    PurchasesCustomerStoreService,
    PurchasesSupplierStoreService,
    PurchasesSupplierReplacementsStoreService,
    SupplierProcedureStoreService
  ]
})
export class PurchaseModule {
}
