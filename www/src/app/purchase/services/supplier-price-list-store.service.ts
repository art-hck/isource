import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Page } from "../../order/models/page";
import { map } from "rxjs/operators";
import { SupplierPriceListItem } from "../models/supplier-price-list-item";
import { HttpClient } from "@angular/common/http";
import { ClrDatagridStateInterface } from '@clr/angular';

@Injectable({
  providedIn: 'root'
})
export class SupplierPriceListStoreService {

  constructor(
    protected api: HttpClient
  ) {
  }

  protected static getCurrentPage(state: ClrDatagridStateInterface): number {
    return Math.floor(state.page.from / state.page.size) + 1;
  }

  getList(searchStr: string, state: ClrDatagridStateInterface): Observable<Page<SupplierPriceListItem>> {
    return this.api.post(
      `/supplier-price-list`,
      {
        searchStr: searchStr,
        pageNumber: SupplierPriceListStoreService.getCurrentPage(state),
        pageSize: state.page.size
      })
      .pipe(
        map((data: any) => {
          return new Page<SupplierPriceListItem>(
            data.entities.map(rawItem => {
              return new SupplierPriceListItem(rawItem);
            }),
            data.totalCount
          );
        })
      );
  }
}
