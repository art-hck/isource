import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {Observable} from "rxjs";
import {CatalogPosition} from "../models/catalog-position";

@Injectable()
export class CatalogService {

  constructor(
    protected api: HttpClient
  ) {
  }

  getPositionsList(): Observable<CatalogPosition[]> {
    return this.api.post<CatalogPosition[]>(`catalog/list`, {});
  }

  searchPositionsByName(searchName: string): Observable<CatalogPosition[]> {
    return this.api.post<CatalogPosition[]>(`catalog/find`, {
      name: searchName
    });
  }
}
