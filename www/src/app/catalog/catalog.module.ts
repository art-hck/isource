import { NgModule } from '@angular/core';
import { CatalogRoutingModule } from './catalog-routing.module';
import { SharedModule } from "../shared/shared.module";
import { CatalogService } from "./services/catalog.service";
import { CategoryViewComponent } from './components/category-view/category-view.component';
import { SearchPanelComponent } from "./components/search-panel/search-panel.component";
import { SearchViewComponent } from "./components/search-view/search-view.component";
import { PositionsListComponent } from "./components/positions-list/positions-list.component";
import { CategoriesTreeComponent } from "./components/categories-tree/categories-tree.component";

@NgModule({
  declarations: [
    SearchViewComponent,
    CategoryViewComponent,

    PositionsListComponent,
    CategoriesTreeComponent,
    SearchPanelComponent
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
