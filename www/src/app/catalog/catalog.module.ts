import { NgModule } from '@angular/core';
import { CatalogRoutingModule } from './catalog-routing.module';
import { SharedModule } from "../shared/shared.module";
import { CatalogService } from "./services/catalog.service";
import { CategoryViewComponent } from './components/category-view/category-view.component';
import { SearchPanelComponent } from "./components/search-panel/search-panel.component";
import { SearchViewComponent } from "./components/search-view/search-view.component";
import { PositionsListComponent } from "./components/positions-list/positions-list.component";
import { CategoriesComponent } from './components/categories/categories.component';
import { ContragentModule } from "../contragent/contragent.module";
import { CatalogComponent } from "./components/catalog/catalog.component";

@NgModule({
  declarations: [
    CatalogComponent,
    SearchViewComponent,
    CategoryViewComponent,

    PositionsListComponent,
    SearchPanelComponent,
    CategoriesComponent
  ],
  imports: [
    SharedModule,
    CatalogRoutingModule,
    ContragentModule
  ],
  providers: [
    CatalogService
  ]
})
export class CatalogModule {
}
