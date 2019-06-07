import { HttpClient } from "@angular/common/http";
import { ItemsdictionaryHttpClient } from "../../core/services/itemsdictionary-http-client.service";
import { Injectable } from "@angular/core";
import { PriceListItem } from "../models/price-list-item";
import { Observable } from "rxjs";
import { Page } from "../../order/models/page";
import { SupplierPriceListItem } from "../../purchase/models/supplier-price-list-item";
import { map } from "rxjs/operators";
import { ClrDatagridStateInterface } from "@clr/angular";

@Injectable()
export class PriceListService {

  constructor(
    protected api: HttpClient,
    protected itemsApi: ItemsdictionaryHttpClient
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
        pageNumber: PriceListService.getCurrentPage(state),
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

  addPriceListItem(priceListItem: PriceListItem) {
    const url = `items/save`;
    return this.itemsApi.post(url,
      {
        currency: {
          code: priceListItem.currency.code,
          name: priceListItem.currency.name,
          rawValue: priceListItem.currency.name
        },
        item_name: priceListItem.itemName,
        nds_percent: +priceListItem.ndsPercent,
        okei: {
          code: priceListItem.units.code,
          name: priceListItem.units.name,
          rawValue: priceListItem.units.name
        },
        price_with_nds: priceListItem.priceWithNds,
        supplier_region: priceListItem.supplierRegion,
        tth: priceListItem.tth
      }
    );
  }
}
