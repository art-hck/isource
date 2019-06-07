import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CustomerPurchase } from '../models/customer-purchase';
import { Uuid } from "../../cart/models/uuid";
import { HttpClient } from "@angular/common/http";
import { SupplierOffer } from "../models/supplier-offer";
import { delay, map } from "rxjs/operators";
import { CustomerPurchaseItem } from "../models/customer-purchase-item";
import { Page } from "../../order/models/page";
import { ClrDatagridStateInterface } from '@clr/angular';
import { PurchaseNoticeItem } from "../models/purchase-notice-item";
import { PurchaseProtocol } from "../models/purchase-protocol";
import {getNotice, getProtocols} from "./test-data/customer-test-data";
import {PurchaseWinnerInfo} from "../models/purchase-winner-info";

@Injectable({
  providedIn: 'root'
})
export class ProcedureCustomerService {

  constructor(
    protected api: HttpClient
  ) {
  }

  protected static getCurrentPage(state: ClrDatagridStateInterface): number {
    return Math.floor(state.page.from / state.page.size) + 1;
  }

  /**
   * Возвращает общую информацию по процедуре
   *
   * @param id
   */
  getProcedureInfo(id: Uuid): Observable<CustomerPurchase> {
    // todo исправть на роут процедуры, как только тот появится
    const url = `procedures/customer/${id}/info`;
    return this.api.post<CustomerPurchase>(url, {});
  }

  /**
   * Возвращает предложения поставщиков
   *
   * @param id
   */
  getSuppliersOffers(id: Uuid): Observable<SupplierOffer[]> {
    const url = `procedures/customer/${id}/suppliers-offers`;
    return this.api.post<SupplierOffer[]>(url, {});
  }

  /**
   * Возвращает позиции для процедуры
   *
   * @param id
   * @param state
   */
  getProcedurePositions(id: Uuid, state: ClrDatagridStateInterface): Observable<Page<CustomerPurchaseItem>> {
    return this.api.post<any>(
      `procedures/customer/${id}/positions`,
      {
        pageNumber: ProcedureCustomerService.getCurrentPage(state),
        pageSize: state.page.size
      })
      .pipe(
        map(data => {
          return new Page<CustomerPurchaseItem>(data.entities, data.totalCount);
        })
      );
  }

  getNotice(id: Uuid): Observable<PurchaseNoticeItem[]> {
    return of(getNotice(id)).pipe(delay(500));
  }

  getProtocols(id: Uuid): Observable<PurchaseProtocol[]> {
    return of(getProtocols(id)).pipe(delay(500));
  }

  getWinnerInfo(id: Uuid): Observable<PurchaseWinnerInfo> {
    const url = `/procedures/customer/${id}/winner-info`;
    return this.api.post<PurchaseWinnerInfo>(url, {});
  }

  setBeneficiaryDocumentResolution(id: Uuid, resolution: boolean) {
    const url = `purchases/customer/${id}/beneficiary/resolution`;
    return this.api.post<any>(url, {'resolution': resolution});
  }

  sendProcedureRequestPriceReduction(id: Uuid, date: string) {
    const url = `/procedures/customer/${id}/price-reduction`;
    return this.api.post<any>(url, {'date': date});
  }

  sendProcedureRequestPriceReductionToWinner(id: Uuid, date: string) {
    const url = `/procedures/customer/${id}/price-reduction-for-winner`;
    return this.api.post<any>(url, {'date': date});
  }
}
