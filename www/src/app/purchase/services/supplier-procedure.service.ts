import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { SupplierPurchase } from '../models/supplier-purchase';
import { Uuid } from "../../cart/models/uuid";
import { HttpClient } from "@angular/common/http";
import {PurchaseNoticeItem} from "../models/purchase-notice-item";
import {getNotice, getProtocols} from "./test-data/customer-test-data";
import {delay} from "rxjs/operators";
import {PurchaseProtocol} from "../models/purchase-protocol";
import {SupplierPurchaseItem} from "../models/supplier-purchase-item";
import {Page} from "../../order/models/page";
import { SupplierPurchaseLinkedItem } from '../models/supplier-purchase-linked-item';
import { Response } from 'src/app/core/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierProcedureService {

  constructor(
    protected api: HttpClient
  ) {
  }

  /**
   * Возвращает общую информацию по процедуре
   *
   * @param id
   */
  getProcedureInfo(id: Uuid): Observable<SupplierPurchase> {
    const url = `procedures/supplier/${id}/info`;
    return this.api.post<SupplierPurchase>(url, {});
  }

  /**
   * Возвращает позиции для процедуры
   *
   * @param id
   */
  getProcedurePositions(id: Uuid): Observable<Page<SupplierPurchaseItem>> {
    return this.api.post<Page<SupplierPurchaseItem>>(`procedures/supplier/${id}/positions`, {});
  }


  getNotice(id: Uuid): Observable<PurchaseNoticeItem[]> {
    return of(getNotice(id)).pipe(delay(500));
  }

  getProtocols(id: Uuid): Observable<PurchaseProtocol[]> {
    return of(getProtocols(id)).pipe(delay(500));
  }

  sendPrice(purchaseId: Uuid, linkedItem: SupplierPurchaseLinkedItem, newPrice: number): Observable<Response<void>> {
    return this.api.post<{success: boolean}>(`procedures/supplier/${purchaseId}/edit-links`, {
      supplierOfferPositionId: linkedItem.id,
      newPrice: newPrice
    });
  }
}
