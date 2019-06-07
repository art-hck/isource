import { RequestPositionOfferChange } from "../../models/request-position-offer-change";
import { getSupplierItemsTestData } from "./supplier-test-data";
import { createRandomRequestPositionOfferChange } from "./model-generators";

/**
 * Модуль тестовых данных
 *
 * TODO: 2018-10-17 Удалить после появления бека
 */

const requestPositionOfferChanges: {[key: string]: RequestPositionOfferChange[]} = {};

export function getList(purchaseId: string): RequestPositionOfferChange[] {
  if (!requestPositionOfferChanges.hasOwnProperty(purchaseId)) {
    const supplierPurchaseItems = getSupplierItemsTestData(purchaseId);
    const items = supplierPurchaseItems.filter((supplierPurchaseItem) => {
      return Boolean(supplierPurchaseItem.replacementRequest);
    }).map(createRandomRequestPositionOfferChange);
    requestPositionOfferChanges[purchaseId] = items;
  }
  return requestPositionOfferChanges[purchaseId];
}
