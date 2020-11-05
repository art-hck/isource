import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { delay } from "rxjs/operators";
import { RegionsMock } from "../mocks/regions.mock";

@Injectable({
  providedIn: 'root'
})
export class OkatoService {

  constructor(protected api: HttpClient) {}

  getRegions() {
    return of(RegionsMock).pipe(delay(100));
  }
}
