import { createRandomAttachedFile } from "./model-generators";
import { getRandomId, getRandomInt } from "./random-generators";
import { AttachedFile } from "../../models/attached-file";
import { PurchaseProtocol } from "../../models/purchase-protocol";
import { PurchaseNoticeItem } from "../../models/purchase-notice-item";
import {PurchaseWinnerInfo} from "../../models/purchase-winner-info";

/**
 * Модуль тестовых данных
 *
 * TODO: 2018-09-21 После создания бека удалить этот модуль
 */

const documents: {[key: string]: AttachedFile[]} = {};

export function getSupplierDocuments(id: string): AttachedFile[] {
  if (documents.hasOwnProperty(id)) {
    return documents[id];
  }
  const count = getRandomInt(0, 10);
  const docs = [];
  for (let i = 0; i < count; i++) {
    docs.push(createRandomAttachedFile());
  }
  documents[id] = docs;
  return docs;
}

/**
 * Тестовые протоколы для процедуры
 * @param id
 */
export function getProtocols(id: string): PurchaseProtocol[] {
  const count = getRandomInt(0, 10);
  const protocols = [];
  for (let i = 0; i < count; i++) {
    protocols.push({
      id: getRandomId(),
      name: 'Протокол №' + getRandomInt(1, 100000)
    });
  }
  return protocols;
}

/**
 * Тестовое извещение для процедуры
 * @param id
 */
export function getNotice(id: string): PurchaseNoticeItem[] {
  return [
    {
      name: 'НМЦ лота с НДС',
      value: '765 000 ₽'
    },
    {
      name: 'Тип закупки',
      value: 'Электронный магазин Росатома'
    },
    {
      name: 'Ответственное лицо',
      value: 'Безрукая Тамара Львовна'
    },
    {
      name: 'Организатор процедуры',
      value: 'ООО «Чудеса в носке»'
    },
    {
      name: 'Наименование заказчика',
      value: 'ОАО «Нет чудес»'
    },
    {
      name: 'Место нахождение',
      value: '187564. РФ, г. Москва, ул. Потемкина д.24'
    },
    {
      name: 'Почтовый адрес',
      value: '187564. РФ, г. Москва, ул. Потемкина д.24'
    },
    {
      name: 'ИНН',
      value: '459685743845'
    },
    {
      name: 'КПП',
      value: '239685736'
    },
    {
      name: 'Требования к заявке',
      value: 'Только МСП'
    },
    {
      name: 'Даты начала поставки',
      value: '24.04.2019'
    },
    {
      name: 'Даты окончания поставки',
      value: '24.05.2019'
    },
    {
      name: 'Адрес доставки',
      value: '187564. РФ, г. Москва, ул. Потемкина д.24'
    }
  ];
}
