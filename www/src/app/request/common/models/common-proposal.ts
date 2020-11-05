import { Uuid } from "../../../cart/models/uuid";
import { DeliveryType } from "../../back-office/enum/delivery-type";
import { RequestDocument } from "./request-document";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";
import { PositionCurrency } from "../enum/position-currency";

export class CommonProposal {
  id: Uuid;
  createdDate: string;
  deliveryAdditionalTerms: string;
  deliveryCurrency: string;
  deliveryPickup: string;
  deliveryPrice: number;
  deliveryType: DeliveryType;
  deliveryTypeLabel: string;
  documents: RequestDocument[];
  items: CommonProposalItem[];
  supplier: ContragentShortInfo;
  warrantyConditions: string;
}

export class CommonProposalItem {
  id: Uuid;
  comments: string;
  createdDate: string;
  currency: PositionCurrency;
  deliveryDate: string;
  isAnalog: boolean;
  isWinner: boolean;
  manufacturer: string;
  manufacturingName?: string;
  measureUnit: string;
  paymentTerms: string;
  priceWithoutVat: number;
  priceWithVat: number;
  quantity: number;
  requestId: Uuid;
  requestPositionId: Uuid;
  standard: string;
  status: CommonProposalItemStatus;
  supplierContragentId?: Uuid; // supplierContragent: ContragentShortInfo;
  vatPercent: number;
}

// @TODO: убрать дублирующие статусы
export type CommonProposalItemStatus =
  'DRAFT' | 'NEW' | // Черновик
  'PROCEDURE_IN_PROGRESS' | // Идет процедура
  'REJECTED' | // Отклонено
  'SENT_TO_REVIEW' | // Отправлено на согласование
  'SENT_TO_EDIT' | // Отправлено на доработку
  'APPROVED' | 'REVIEWED' | // Рассмотрено
  'PARTIALLY_REVIEWED'; // Частично рассмотрено
