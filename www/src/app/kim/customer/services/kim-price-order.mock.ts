import { KimPriceOrderProposals } from "../../common/models/kim-price-order-proposals";
import { KimPriceOrderStatus } from "../../common/enum/kim-price-order-status";
import { PositionCurrency } from "../../../request/common/enum/position-currency";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";
import { KimPriceOrderType } from "../../common/enum/kim-price-order-type";
import { Guid } from "guid-typescript";

const ids = [
  Guid.create().toString(),
  Guid.create().toString(),
  Guid.create().toString(),
  Guid.create().toString(),
  Guid.create().toString(),
];

const contragents = [
  getContragent('ОАО "СОЮЗ"'),
  getContragent('ООО "РОГА И КОПЫТА"'),
  getContragent('ОАО "АТП-12"'),
  getContragent('АО "МАСТЕР ФА"'),
  getContragent('ООО "БалТехКомбинат"'),
  getContragent('АО КК "ЭЛЕФАНТ"'),
  getContragent('ООО "ГАРАЖ`65"')
];

function getContragent(name): ContragentShortInfo {
  return {
    id: Guid.create().toString(),
    fullName: name,
    shortName: name,
    inn: "6452915710",
    kpp: "771401001",
    email: "smu36@mail.ru"
  };
}

function getProposalPosition(i = 0, j = 0, isWinner = false) {

  return {
    id: Guid.create().toString(),
    proposalId: Guid.create().toString(),
    priceWithVat: 3600,
    priceWithoutVat: 3600,
    vatPercent: 0,
    currency: PositionCurrency.RUB,
    quantity: 10,
    measureUnit: "шт",
    deliveryDate: "2020-04-28T09:05:56+00:00",
    paymentTerms: "30 дней со дня поставки по факту оказания всех услуг",
    supplier: contragents[i],
    isAnalog: false,
    isWinner,
    position: {
      id: ids[j],
      name: "Ручка гелевая",
      quantity: 10
    }
  };
}

export const PriceOrderProposalsMock: KimPriceOrderProposals = {
  id: "3a3c4c1d-9cf3-4530-ab07-7f2569330d13",
  etpKimId: 2853,
  userId: "790f24e6-3841-4663-8a93-e5c15f054f02",
  user: null,
  contragentId: "a8a980b7-2727-4d23-b87f-b2c63bb83cc5",
  contragent: null,
  name: "Ценовой запрос на поставку пиломатериалов",
  deliveryAddress: "",
  deliveryConditions: "",
  dateResponse: "2020-05-01T09:00:00+00:00",
  dateDelivery: "2020-05-01T21:00:00+00:00",
  isForSmallBusiness: false,
  isForProducer: false,
  isForAuthorizedDealer: false,
  isRussianProduction: false,
  isDenyMaxPricePosition: false,
  regions: "41000000000",
  createdDate: "2020-04-28T09:05:56+00:00",
  status: KimPriceOrderStatus.DRAFT,
  statusLabel: "\u0427\u0435\u0440\u043d\u043e\u0432\u0438\u043a",
  type: KimPriceOrderType.STANDART,
  data: [
    {
      position: {
        id: ids[0],
        name: "Ручка гелевая",
        okpd2: "41000000000",
        quantity: 10,
        okei: "41000000000",
      },
      proposalPositions: [
        getProposalPosition(2, 0),
        getProposalPosition(0, 0),
        getProposalPosition(1, 0),
        getProposalPosition(3, 0, true)
      ]
    },
    {
      position: {
        id: ids[1],
        name: "Плитка тротуарная",
        okpd2: "41000000000",
        quantity: 10,
        okei: "41000000000",
      },
      proposalPositions: [
        getProposalPosition(0, 1),
        getProposalPosition(1, 1)
      ]
    },
    {
      position: {
        id: ids[2],
        name: "Samsung Galaxy S8",
        okpd2: "41000000000",
        quantity: 10,
        okei: "41000000000",
      },
      proposalPositions: [
        getProposalPosition(0, 2),
        getProposalPosition(2, 2),
        getProposalPosition(1, 2)
      ]
    },
    {
      position: {
        id: ids[4],
        name: "Coca Cola 2л.",
        okpd2: "41000000000",
        quantity: 10,
        okei: "41000000000",
      },
      proposalPositions: [
        getProposalPosition(6, 4),
        getProposalPosition(0, 4),
        getProposalPosition(2, 4),
        getProposalPosition(4, 4),
        getProposalPosition(5, 4),
        getProposalPosition(3, 4),
        getProposalPosition(1, 4),
      ]
    },
    {
      position: {
        id: ids[3],
        name: "Медиаплеер Philips",
        okpd2: "410000000213",
        quantity: 10,
        okei: "4100032100000",
      },
      proposalPositions: [
        getProposalPosition(1, 3, true),
        getProposalPosition(2, 3)
      ]
    },
  ]
};
