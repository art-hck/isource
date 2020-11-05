import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Okpd2 } from "../models/okpd2";
import { Okpd2Mock } from "../mocks/okpd2-mock";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class Okpd2Service {

  constructor(protected api: HttpClient) {
  }

  getOkpd2(searchText: string) {
    return this.api.post<Okpd2[]>(`okpd`, {searchText});
  }

  getOkpd2Mock() {
    return of(Okpd2Mock).pipe(delay(100));
  }
}
