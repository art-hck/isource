import { Injectable } from '@angular/core';
import {AppConfig} from "../../config/app.config";
import {Uuid} from "../../cart/models/uuid";
import {HttpClient} from "@angular/common/http";
import {Response} from "../../core/models/response.model";
import {PricelistItem} from "../models/pricelist-item";

@Injectable({
  providedIn: 'root'
})
export class PricelistStoreService {

  constructor(
    protected http: HttpClient
  ) {
  }

  async loadTopPrices(productId: Uuid): Promise<PricelistItem[]> {
    const url = AppConfig.endpoints.api + 'catalog-product/top-prices';
    const data = await this.http.post<Response<PricelistItem[]>>(url, {
        product_id: productId
      },
      {
        responseType: 'json',
      }).toPromise();

    if (data.success) {
      return data.data;
    }

    throw new Error('Cannot load top prices');
  }
}
