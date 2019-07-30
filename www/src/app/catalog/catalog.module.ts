import { NgModule } from '@angular/core';
import { CatalogRoutingModule } from './catalog-routing.module';
import { SharedModule } from "../shared/shared.module";
import { CatalogComponent } from "./components/catalog/catalog.component";
import { CatalogPositionsListComponent } from "./components/catalog-positions-list/catalog-positions-list.component";
import { CatalogCategoriesTreeComponent } from "./components/catalog-categories-tree/catalog-categories-tree.component";
import { CatalogService } from "./services/catalog.service";

@NgModule({
  declarations: [
    CatalogComponent,
    CatalogPositionsListComponent,
    CatalogCategoriesTreeComponent
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
