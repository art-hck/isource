import { NgModule } from '@angular/core';
import { SharedModule } from "../shared/shared.module";
import { PriceListService } from "./services/price-list.service";
import { PriceListComponent } from "./components/price-list/price-list.component";
import { AddItemModalComponent } from "./components/add-item-modal/add-item-modal.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    PriceListComponent,
    AddItemModalComponent
  ],
  providers: [
    PriceListService
  ]
})
export class PriceListModule { }
