import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CatalogPosition } from "../models/catalog-position";
import { CatalogCategory } from "../models/catalog-category";
import { Uuid } from "../../cart/models/uuid";

@Injectable()
export class CatalogService {

  constructor(
    protected api: HttpClient
  ) {
  }

  getPositionsList(categoryId: Uuid): Observable<CatalogPosition[]> {
    return this.api.post<CatalogPosition[]>(`catalog/list`, {});
  }

  searchPositionsByName(searchName: string): Observable<CatalogPosition[]> {
    return this.api.post<CatalogPosition[]>(`catalog/find`, {
      name: searchName
    });
  }

  getCategoryInfo(categoryId: Uuid): Observable<CatalogCategory> {
    return this.api.get<CatalogCategory>(`catalog/categories/${categoryId}/info`);
  }

  getCategoriesTree(categoryId: Uuid = null): Observable<CatalogCategory[]> {
    let body = {};
    if (categoryId) {
      body = {
        parentId: categoryId
      };
    }
    return this.api.post<CatalogCategory[]>(`catalog/categories/childs`, body);
  }
}
