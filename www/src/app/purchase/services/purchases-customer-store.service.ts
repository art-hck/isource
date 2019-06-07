import {Injectable, Input} from '@angular/core';
import { Observable, of } from 'rxjs';
import { getSupplierDocuments } from './test-data/customer-test-data';
import { CustomerPurchase } from '../models/customer-purchase';
import { Uuid } from "../../cart/models/uuid";
import { SupplierOffer } from "../models/supplier-offer";
import { CustomerPurchaseItem } from '../models/customer-purchase-item';
import { AttachedFile } from '../models/attached-file';
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Page } from "../../order/models/page";
import { ClrDatagridStateInterface } from '@clr/angular';

@Injectable({
  providedIn: 'root'
})

export class PurchasesCustomerStoreService {

  @Input() supplierOffer?: SupplierOffer;

  public supplierName = '';

  protected data: CustomerPurchase[] = [];
  public totalCount: number;

  constructor(
    protected api: HttpClient
  ) {
  }

  protected static getCurrentPage(state: ClrDatagridStateInterface) {
    return Math.floor(state.page.from / state.page.size) + 1;
  }

  getPurchasesList(): CustomerPurchase[] {
    return this.data;
  }

  async loadPage(filters) {
    this.data = await this.api.post<CustomerPurchase[]>('purchases/customer/list', { filters: filters })
      .toPromise();
    return this.data;
  }

  getPurchaseInfoForCustomer(id: Uuid): Observable<CustomerPurchase> {
    const url = `/purchases/customer/${id}/info`;
    return this.api.post<CustomerPurchase>(url, {});
  }


  getPurchasePositionsInfoForCustomer(id: Uuid, state: ClrDatagridStateInterface): Observable<Page<CustomerPurchaseItem>> {
    return this.api.post<any>(
      `purchases/customer/${id}/positions`,
      {
        pageNumber: PurchasesCustomerStoreService.getCurrentPage(state),
        pageSize: state.page.size
      }).pipe(
      map(data => {
        // todo оставил totalCount т.к. он еще используется. Выпилить!
        this.totalCount = data.totalCount;
        return new Page<CustomerPurchaseItem>(data.entities, data.totalCount);
      })
    );
  }

  getSuppliersOffers(id: Uuid): Observable<SupplierOffer[]> {
    const url = `purchases/customer/${id}/suppliers-offers`;
    return this.api.post<SupplierOffer[]>(url, {});
  }

  sendCreatedProcedure(id: Uuid) {
    const url = `/requirements/customer/${id}/copy-requirement-to-procedure`;
    return this.api.post<any>(url, {});
  }

  createOrder(id: Uuid) {
    const url = `/procedures/customer/${id}/create-order`;
    return this.api.post<any>(url, {});
  }
}
