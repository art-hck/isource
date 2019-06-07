import { NgModule } from '@angular/core';
import { DictionaryRoutineModule } from "./dictionary-routine.module";
import { SupplierDictionaryListComponent } from './components/supplier/supplier-dictionary-list/supplier-dictionary-list.component';
import { SupplierPriceListConnectionComponent } from './components/supplier/supplier-price-list-connection/supplier-price-list-connection.component';
import { DictionaryStoreService } from "./services/dictionary-store.service";
import { SharedModule } from "../shared/shared.module";
import { AddPositionToPriceListModalComponent } from './components/supplier/add-position-to-price-list-modal/add-position-to-price-list-modal.component';


@NgModule({
  imports: [
    SharedModule,
    DictionaryRoutineModule
  ],
  declarations: [
    SupplierDictionaryListComponent,
    SupplierPriceListConnectionComponent,
    AddPositionToPriceListModalComponent
  ],
  providers: [
    DictionaryStoreService
  ]
})
export class DictionaryModule { }
