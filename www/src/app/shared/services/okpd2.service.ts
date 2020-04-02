import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Okpd2Mock } from "../mocks/okpd2-mock";
import { delay } from "rxjs/operators";
import { RegionsMock } from "../mocks/regions.mock";

@Injectable({
  providedIn: 'root'
})
export class OkatoService {

  constructor(protected api: HttpClient) {}

  getOkpd2() {
    return of(Okpd2Mock).pipe(delay(100));
  }

  getRegions() {
    return of(RegionsMock).pipe(delay(100));
  }

}
