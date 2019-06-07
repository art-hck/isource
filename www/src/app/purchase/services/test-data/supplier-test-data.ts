import {Uuid} from "../../../cart/models/uuid";
import {Customer} from "../../models/customer";
import {SupplierPurchase} from "../../models/supplier-purchase";
import {createRandomSupplierPurchaseItemWithLinkedItems} from "./model-generators";
import { SupplierPurchaseItem } from "../../models/supplier-purchase-item";
import { getRandomInt } from "./random-generators";

/**
 * Модуль тестовых данных
 *
 * TODO: 2018-09-21 После создания бека удалить этот модуль
 */

export const customer: Customer = {
  name: 'ООО "Первая тоннелестроительная компания"'
};

export const SupplierItemsTestData: {[supplierPurchaseId: string]: SupplierPurchaseItem[]} = {};

export const SupplierTestData: Array<SupplierPurchase> = [
  {
    id: '2fb29b6a-2cce-4533-be8d-468bfc56fce4',
    typeName: 'Предложение',
    number: '1',
    positionsCount: 3,
    creationDate: new Date('2018-01-01T00:00:10+0300'),
    startMaxCost: 10.5,
    title: 'Закупка фруктов и овощей',
    customer: customer,
    deliveryCost: 0,
    deliveryAddress: '680097, г. Санкт-Петербург, Невский проспект, дом 28',
    offerCost: 0,
    offerCount: 0,
    isWinner: false
  },
  {
    id: 'b3bf6fc9-fdfb-4f7f-ae79-da466d767ced',
    typeName: 'Предложение',
    number: '2',
    positionsCount: 2,
    creationDate: new Date('2018-06-01T12:34:56+0300'),
    startMaxCost: 21,
    title: 'Оргтехника',
    customer: customer,
    deliveryCost: 0,
    deliveryAddress: '145673, г. Подольск, Октябрьский проспект, дом 2В, кв. 82',
    offerCost: 0,
    offerCount: 0,
    isWinner: false
  },
  {
    id: '887c4b90-02bc-4896-bbc3-0e933cd9b040',
    typeName: 'Предложение',
    number: '123',
    positionsCount: 6,
    creationDate: new Date('2018-09-20T10:20:00+1100'),
    startMaxCost: 100500,
    title: 'Горнопроходческое оборудование',
    customer: customer,
    deliveryCost: 0,
    deliveryAddress: '889065, г. Москва, ул. Льва Толстого, дом 16',
    offerCost: 0,
    offerCount: 0,
    isWinner: false
  }
];

export function getPurchaseInfoForSupplier(id: Uuid): SupplierPurchase|null {
  // всегда берем первый элемент, чтобы корретно работало с беком
  id = SupplierTestData[0].id;

  const item: SupplierPurchase|void = SupplierTestData.find((i) => {
    return (i.id === id);
  });
  if (item) {
    const sum = getSupplierPurchaseItemsSum(id, SupplierItemsTestData[id]);
    item.offerCost = sum;
  }
  return item ? item : null;
}

for (const supplierPurchase of SupplierTestData) {
  const randomsCount = getRandomInt(5, 18);
  const supplierPurchaseId = supplierPurchase.id;
  const items = [];
  for (let i = 0; i < randomsCount; i++) {
    items.push(createRandomSupplierPurchaseItemWithLinkedItems());
  }
  SupplierItemsTestData[supplierPurchaseId] = items;
}

export function getSupplierItemsTestData(supplierPurchaseId: Uuid): Array<SupplierPurchaseItem> {
  return SupplierItemsTestData[supplierPurchaseId];
}

function getLinkedItemSum(item: SupplierPurchaseItem): number {
  if (!item.linkedItems || item.linkedItems.length === 0) {
    return 0;
  }
  for (const linkedItem of item.linkedItems) {
    if (!linkedItem.analogue) {
      return linkedItem.price * item.quantity;
    }
  }
  return 0;
}

function getSupplierPurchaseItemsSum(supplierPurchaseId: Uuid, supplierPurchaseItems: SupplierPurchaseItem[]): number {
  const data = getSupplierItemsTestData(supplierPurchaseId);
  let sum = 0;
  for (const item of data) {
    if (!item.availability || !item.linkedItems || item.linkedItems.length === 0) {
      continue;
    }
    sum += getLinkedItemSum(item);
  }
  return sum;
}

for (const supplierPurchase of SupplierTestData) {
  const sum = getSupplierPurchaseItemsSum(supplierPurchase.id, SupplierItemsTestData[supplierPurchase.id]);
  supplierPurchase.offerCost = sum;
  supplierPurchase.startMaxCost = sum * 1.2;
}
