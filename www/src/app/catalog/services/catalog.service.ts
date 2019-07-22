import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class CatalogService {

  constructor(
    protected api: HttpClient
  ) {
  }

  getPositionsList() {
    return this.api.post(`catalog/list`, {});
  }
}
