import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { CatalogPosition } from "../models/catalog-position";
import { CatalogCategory } from "../models/catalog-category";
import { Uuid } from "../../cart/models/uuid";
import { tap } from "rxjs/operators";
import { CatalogCategoryAttribute } from "../models/catalog-category-attribute";
import { SearchResults } from "../models/search-results";

@Injectable()
export class CatalogService {

  protected categoryForMenu: CatalogCategory[];

  constructor(
    protected api: HttpClient
  ) {
  }

  getPositionsList(categoryId: Uuid, filters?: {}): Observable<CatalogPosition[]> {
    const body = {categoryId, filters};
    return this.api.post<CatalogPosition[]>(`catalog/list`, body);
  }

  searchSuggestions(query: string, countCategories?: number, countPositions?: number): Observable<SearchResults> {
    const body = {query, countCategories, countPositions};
    return this.api.post<SearchResults>(`catalog/search-suggestions`, body);
  }

  searchPositionsByName(name: string, filters?: {}, count?: number): Observable<CatalogPosition[]> {
    const body = {name, filters, count};
    return this.api.post<CatalogPosition[]>(`catalog/find`, body);
  }

  getPositionInfo(positionId: Uuid): Observable<CatalogPosition> {
    return this.api.get<CatalogPosition>(`catalog/position/${positionId}/info`);
  }

  getCategoryInfo(categoryId: Uuid): Observable<CatalogCategory> {
    return this.api.get<CatalogCategory>(`catalog/categories/${categoryId}/info`);
  }

  getCategoryChilds(categoryId: Uuid): Observable<CatalogCategory[]> {
    return this.api.get<CatalogCategory[]>(`catalog/categories/${categoryId}/childs`);
  }

  getCategoryAttributes(categoryId: Uuid): Observable<CatalogCategoryAttribute[]> {
    return this.api.get<CatalogCategoryAttribute[]>(`catalog/categories/${categoryId}/attributes`);
  }

  getCategoriesTree(): Observable<CatalogCategory[]> {
    // кешируем список категорий
    if (this.categoryForMenu) {
      return of(this.categoryForMenu);
    }

    return this.api.post<CatalogCategory[]>(`catalog/categories/menu`, {}).pipe(
      tap((categories: CatalogCategory[]) => {
        this.categoryForMenu = categories;
      })
    );
  }

  getPositionAttributes(positionId: Uuid): Observable<CatalogCategoryAttribute[]> {
    return this.api.get<CatalogCategoryAttribute[]>(`catalog/position/${positionId}/attributes`);
  }
}
