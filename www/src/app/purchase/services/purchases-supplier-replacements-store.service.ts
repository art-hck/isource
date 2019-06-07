import { Injectable } from '@angular/core';
import { Uuid } from 'src/app/cart/models/uuid';
import { of } from 'rxjs';
import { SupplierPurchase } from '../models/supplier-purchase';
import { getPurchaseInfoForSupplier } from './test-data/supplier-test-data';
import { RequestPositionOfferChange } from '../models/request-position-offer-change';
import { getList } from './test-data/supplier-replacements-test-data';

@Injectable()
export class PurchasesSupplierReplacementsStoreService {

  purchaseId: Uuid;
  purchaseInfo: SupplierPurchase;
  requestPositionOfferChanges: RequestPositionOfferChange[] = [];

  constructor() { }

  loadPurchaseInfo(): void {
    of(getPurchaseInfoForSupplier(this.purchaseId)).subscribe((data) => {
      this.purchaseInfo = data;
    });
  }

  loadRequestPositionOfferChanges(): void {
    of(getList(this.purchaseId)).subscribe((data) => {
      this.requestPositionOfferChanges = data;
    });
  }

}
