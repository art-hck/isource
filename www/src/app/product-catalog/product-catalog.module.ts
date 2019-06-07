import { NgModule } from '@angular/core';
import { ProductCatalogComponent } from './page/product-catalog.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { OffersCountPresentation } from "./pipes/offers-count-presentation.pipe";
import { ProductCatalogRoutineModule } from "./product-catalog-routine.module";
import { CatalogProductsStoreService } from "./services/catalog-products-store.service";
import { MainSearchComponent } from './components/main-search/main-search.component';
import { CategoriesFiltersComponent } from './components/categories-filters/categories-filters.component';
import { MainFiltersComponent } from './components/main-filters/main-filters.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    ProductCatalogRoutineModule
  ],
  exports: [
    ProductCatalogComponent,
    ProductCardComponent
  ],
  declarations: [
    ProductCatalogComponent,
    ProductCardComponent,
    OffersCountPresentation,
    MainSearchComponent,
    CategoriesFiltersComponent,
    MainFiltersComponent
  ],
  providers: [
    CatalogProductsStoreService
  ]
})
export class ProductCatalogModule { }
