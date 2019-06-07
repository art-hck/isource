import { Injectable } from '@angular/core';
import { CatalogProduct } from '../models/catalog-product';
import { AggregatedResult } from "../../core/models/aggregated-result";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CatalogProductsStoreService {
  constructor(
    protected api: HttpClient
  ) {
  }

  loadPage(catalogCode: string, currentPage: number, pageSize: number): Observable<AggregatedResult<CatalogProduct>> {
    const url = 'catalog-products/products-list';
    return this.api.post<AggregatedResult<CatalogProduct>>(url, {
        catalogCode: catalogCode,
        pageNumber: currentPage,
        pageSize: pageSize
      },
      {
        responseType: 'json',
      }).pipe();
  }
}
