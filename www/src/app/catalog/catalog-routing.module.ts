import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from "./components/catalog/catalog.component";
import { CatalogCategoriesTreeComponent } from "./components/catalog-categories-tree/catalog-categories-tree.component";
import { CatalogPositionsListComponent } from "./components/catalog-positions-list/catalog-positions-list.component";

const routes: Routes = [
  {
    path: '',
    component: CatalogComponent
  },
  {
    path: ':categoryId',
    component: CatalogCategoriesTreeComponent
  },
  {
    path: ':categoryId/positions',
    component: CatalogPositionsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule {
}
