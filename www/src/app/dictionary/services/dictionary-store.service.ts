import { Injectable } from '@angular/core';
import { SupplierDictionary } from "../models/supplier-dictionary";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Uuid } from "../../cart/models/uuid";
import { ClrDatagridStateInterface } from '@clr/angular';
import { ItemsdictionaryHttpClient } from "../../core/services/itemsdictionary-http-client.service";

@Injectable()
export class DictionaryStoreService {

  protected data: SupplierDictionary[] = [];
  public itemsCount: number;

  constructor(
    protected api: HttpClient,
    protected itemsApi: ItemsdictionaryHttpClient
  ) {
  }

  protected static getCurrentPage(state: ClrDatagridStateInterface): number {
    return Math.floor(state.page.from / state.page.size) + 1;
  }

  getSupplierDictionaryList(catalogCode: string, isSoonPurchased: boolean, state: ClrDatagridStateInterface) {
    const url = `catalog-products/products-list`;
    return this.api.post(url,
    {
      catalogCode: catalogCode,
      isSoonPurchased: isSoonPurchased,
      pageNumber: DictionaryStoreService.getCurrentPage(state),
      pageSize: state.page.size
    }
    ).pipe(
      map((data: any) => {
        this.itemsCount = data.totalCount;
        return data.entities.map((item): SupplierDictionary => {
          return <SupplierDictionary>item;
        });
      })
    );
  }

  sendLinkItems(priceListItemId: Uuid, dictionaryItemId: Uuid) {
    const url = `pricelist-items-links/register-links`;
    return this.itemsApi.post(url,
      {
        category_product_id: dictionaryItemId,
        item_ids: [priceListItemId]
      }
    );
  }
  addPositionToPriceList(dictionaryItemId: Uuid, dictionaryItemTitle: string, nds: number, pricePosition: number) {
    const url = `items/save-from-category-product-with-link`;
    return this.itemsApi.post(url,
      {
        product_id: dictionaryItemId,
        item_name: dictionaryItemTitle,
        item_nds: nds,
        item_price_with_nds: pricePosition
      }
    );
  }
}
