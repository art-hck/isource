import { Injectable } from '@angular/core';
import { NsiHttpClient } from "./nsi-http-client.service";
import { Observable } from "rxjs";
import { MeasureUnitItem } from "../models/measure-unit-item";
import { CurrencyItem } from "../models/currency-item";
import { Okpd2Item } from "../models/okpd2-item";
import { Okved2Item } from "../models/okved2-item";

@Injectable({
  providedIn: 'root'
})
export class NsiService {

  constructor(
    protected nsi: NsiHttpClient
  ) {
  }

  /**
   * Единицы измерения
   *
   * @param query
   * @param page
   * @param start
   * @param limit
   */
  public getMeasureUnitList(
    query: string = '',
    page: number = 0,
    start: number = 0,
    limit: number = 0
  ): Observable<MeasureUnitItem[]> {
    const params = {
      query: query,
      page: page.toString(),
      start: start.toString(),
      limit: limit.toString()
    };

    return this.nsi.get<MeasureUnitItem[]>('list/okei', {params: params});
  }

  /**
   * Валюты
   *
   * @param query
   * @param short_list
   * @param page
   * @param start
   * @param limit
   */
  public getCurrencyList(
    query: string = '',
    short_list: boolean = true,
    page: number = 0,
    start: number = 0,
    limit: number = 0
  ): Observable<CurrencyItem[]> {
    const params = {
      query: query,
      short_list: short_list.toString(),
      page: page.toString(),
      start: start.toString(),
      limit: limit.toString()
    };

    return this.nsi.get<CurrencyItem[]>('list/okv', {params: params});
  }

  /**
   * Okpd2
   *
   * @param node
   */
  public getOkpd2Tree(
      node: string = 'root',
  ): Observable<Okpd2Item[]> {
    const params = {
      node: node
    };

    return this.nsi.get<Okpd2Item[]>('tree/okpd2/children', {params: params});
  }


  /**
   * Okved2
   *
   * @param node
   */
  public getOkved2Tree(
      node: string = 'root',
  ): Observable<Okved2Item[]> {
    const params = {
      node: node
    };

    return this.nsi.get<Okved2Item[]>('tree/okved2/children', {params: params});
  }

}
