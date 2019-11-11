import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { CatalogPosition } from "../models/catalog-position";
import { CatalogCategory } from "../models/catalog-category";
import { Uuid } from "../../cart/models/uuid";
import { tap } from "rxjs/operators";
import { CatalogCategoryAttribute } from "../models/catalog-category-attribute";

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

  searchPositionsByName(searchName: string): Observable<CatalogPosition[]> {
    return this.api.post<CatalogPosition[]>(`catalog/find`, {
      name: searchName
    });
  }

  getPositionInfo(positionId: Uuid): Observable<CatalogPosition> {
    return this.api.get<CatalogPosition>(`catalog/position/${positionId}/info`);
  }

  getCategoryInfo(categoryId: Uuid): Observable<CatalogCategory> {
    return this.api.get<CatalogCategory>(`catalog/categories/${categoryId}/info`);
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
}
