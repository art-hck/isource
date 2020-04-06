import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { FormDataService } from "../../../shared/services/form-data.service";
import { KimPriceOrder } from "../../common/models/kim-price-order";
import { KimPriceOrdersMock } from "./kim-price-orders.mock";
import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { Guid } from "guid-typescript";

@Injectable()
export class KimPriceOrderService {
  constructor(private api: HttpClient, private formDataService: FormDataService) {}

  list() {
    const url = `kim/customer/add-price-order/list`;
    return of(KimPriceOrdersMock).pipe(delay(1000));
    return this.api.get<KimPriceOrder[]>(url);
  }

  create(body: Partial<KimPriceOrder>) {
    const url = `kim/customer/add-price-order/manual`;
    return of({...body, id: Guid.create().toString()});
    return this.api.post(url, this.formDataService.toFormData(body));
  }
}
