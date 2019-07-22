import { NgModule } from '@angular/core';
import { CatalogRoutingModule } from './catalog-routing.module';
import { SharedModule } from "../shared/shared.module";
import { CatalogComponent } from "./components/catalog/catalog.component";
import { CatalogPositionsListComponent } from "./components/catalog-positions-list/catalog-positions-list.component";
import {CatalogService} from "./services/catalog.service";

@NgModule({
  declarations: [
    CatalogComponent,
    CatalogPositionsListComponent
  ],
  imports: [
    SharedModule,
    CatalogRoutingModule
  ],
  providers: [
    CatalogService
  ]
})
export class CatalogModule {
}
