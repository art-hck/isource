import { PurchaseType } from "../../models/purchase-type";
import { PurchaseWorkflowStep } from "../../models/purchase-workflow-step";
import { PurchaseTypes } from "../../enums/purchase-types";
import { PurchaseTypeLabels } from "../../dictionaries/purchase-type-labels";
import { PurchaseWorkflowStepStatuses } from "../../enums/purchase-workflow-step-statuses";
import { PurchaseWorkflowStepLabelsForFilter } from "../../dictionaries/purchase-workflow-step-labels-for-filter";
import { getRandomId, getRandomInt, getRandomBoolean, getRandomDate } from "./random-generators";
import { SupplierPurchaseLinkedItem } from "../../models/supplier-purchase-linked-item";
import { SupplierPurchaseItem } from "../../models/supplier-purchase-item";
import { SupplierPurchase } from "../../models/supplier-purchase";
import { ReplacementRequest } from "../../models/replacement-request";
import { ReplacementRequests } from "../../enums/replacement-requests";
import { RequestPositionOfferChange } from "../../models/request-position-offer-change";
import { PurchaseItem } from "../../models/purchase-item";
import { OfferChangeItem } from "../../models/offer-change-item";
import { AttachedFile } from "../../models/attached-file";

/**
 * Модуль тестовых данных
 *
 * TODO: 2018-09-28 После создания бека удалить этот модуль
 */

export function createPurchaseType(code: string): PurchaseType {
  if (!(code in PurchaseTypes)) {
    throw new Error('Wrong code value');
  }
  return {
    code: code,
    label: PurchaseTypeLabels[code]
  };
}

export function createPurchaseWorkflowStep(code: string): PurchaseWorkflowStep {
  if (!(code in PurchaseWorkflowStepStatuses)) {
    throw new Error('Wrong code value');
  }
  return {
    code: code,
    label: PurchaseWorkflowStepLabelsForFilter[code]
  };
}

export function createRandomSupplierPurchaseLinkedItem(analogue: boolean = false, isMainItem: boolean = false): SupplierPurchaseLinkedItem {
  return {
    id: getRandomId(),
    title: 'Набор шариковых ручек Beifa AA999-4 (толщина 0.5 мм, 4 штуки)',
    price: getRandomInt(120, 180),
    analogue: analogue,
    isMainItem: isMainItem,
  };
}

export function createRandomSupplierPurchaseItem(availability: boolean): SupplierPurchaseItem {
  const titles = [
    'Ручка шариковая автоматическая черная (толщина линии 0.5 мм)',
    'Ручка шариковая автоматическая синяя (толщина линии 0.7 мм)',
    'Набор шариковых ручек (толщина линии 0.5 мм, 4 штуки)',
    'Ручка шариковая неавтоматическая синяя (толщина линии 0.35 мм, 20 штук в уп.)'
  ];
  const title = titles[getRandomInt(1, 4)];
  const item: SupplierPurchaseItem = {
    id: getRandomId(),
    title: title,
    quantity: getRandomInt(20, 120),
    linkedItems: [],
    availability: availability
  };
  const replacementRequest = createRandomReplacementRequest();
  if (replacementRequest) {
    item.replacementRequest = replacementRequest;
  }
  return item;
}

export function createRandomReplacementRequest(): ReplacementRequest|null {
  if (!getRandomBoolean()) {
    return null;
  }
  const keys = Object.keys(ReplacementRequests);
  const rndKey = keys[getRandomInt(0, keys.length)];
  const replacementRequest: ReplacementRequest = {
    status: ReplacementRequests[rndKey]
  };
  return replacementRequest;
}

export function createRandomSupplierPurchaseItemWithLinkedItems(): SupplierPurchaseItem {
  const availability = getRandomBoolean();
  const item = createRandomSupplierPurchaseItem(availability);
  const defaultAnalogue = true;
  if (availability) {
    const randomCount = getRandomInt(1, 3);
    const linkedItems: SupplierPurchaseLinkedItem[] = [];
    for (let i = 0; i < randomCount; i++) {
      const linkedItem = createRandomSupplierPurchaseLinkedItem(defaultAnalogue);
      linkedItems.push(linkedItem);
    }
    linkedItems[0].analogue = false;
    linkedItems[0].isMainItem = true;
    item.linkedItems = linkedItems;
  }
  return item;
}

export function cloneSupplierPurchaseItem(item: SupplierPurchaseItem): SupplierPurchaseItem {
  const newItem: SupplierPurchaseItem = {...item};
  if (item.linkedItems && item.linkedItems.length > 0) {
    const newLinkedItems: SupplierPurchaseLinkedItem[] = item.linkedItems.map((linkedItem: SupplierPurchaseLinkedItem): SupplierPurchaseLinkedItem => {
      return {...linkedItem};
    });
    newItem.linkedItems = newLinkedItems;
  }
  return newItem;
}

export function cloneSupplierPurchase(supplierPurchase: SupplierPurchase): SupplierPurchase {
  return {...supplierPurchase};
}

export function createRandomOfferChangeItem(): OfferChangeItem {
  const linkedItem = createRandomSupplierPurchaseLinkedItem(false);
  return {
    id: linkedItem.id,
    price: linkedItem.price,
    title: linkedItem.title
  };
}

export function createRandomRequestPositionOfferChange(purchaseItem: PurchaseItem): RequestPositionOfferChange {
  return {
    position: {
      id: purchaseItem.id,
      quantity: purchaseItem.quantity,
      title: purchaseItem.title
    },
    initialOffer: createRandomOfferChangeItem(),
    offerForChange: createRandomOfferChangeItem()
  };
}

export function createRandomAttachedFile(): AttachedFile {
  const documents = [
    'Лицензия на торговлю плюшками.pdf',
    'Разрашение на хранение оружия.docx',
    'Разрешение на перевозку опасных веществ.html',
    'Лицензия на разведение крупного рогатого скота.txt',
    'Разрешение на охоту на медведей голыми руками.jpg',
    'Патент на алфавит.abc',
    'Классные фотки из отпуска.zip',
    'Чертёж дирижабля.js'
  ];
  const title = documents[getRandomInt(0, documents.length)];
  const date = getRandomDate(new Date('2015-01-01T00:00:00+0300'), new Date());
  return {
    id: getRandomId(),
    filename: title,
    docType: 'CERTIFICATE_OF_BENEFICIARIES',
    uploadDate: date
  };
}
