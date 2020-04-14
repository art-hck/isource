import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { KimDictionaryItem } from "../../common/models/kim-dictionary-item";
import { KimDictionaryItemsMock } from "./kim-price-orders.mock";
import { of } from "rxjs";

@Injectable()
export class KimItemsDictionaryService {
  constructor(private api: HttpClient) {}

  search(name: string) {
    // const url = `kim/customer/items-dictionary/search`;
    // return this.api.post<KimDictionaryItem[]>(url, {name: name});
    return of(KimDictionaryItemsMock);
  }
}
