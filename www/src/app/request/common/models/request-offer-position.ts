import {Uuid} from "../../../cart/models/uuid";
import { RequestDocument } from "./request-document";
import { RequestPosition } from "./request-position";
import { ContragentList } from "../../../contragent/models/contragent-list";
import { Contragent } from "../../../core/models/contragent";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";

export class RequestOfferPosition {
  comments?: string;
  createdDate?: string;
  customerContragentId?: string;
  deliveryDate?: string;
  id: Uuid;
  paymentTerms?: string;
  priceWithVat: number;
  priceWithoutVat: number;
  quantity: number;
  currency: string;
  measureUnit: string;
  requestPosition: RequestPosition;
  requestId?: Uuid;
  requestLotId?: Uuid;
  requestPositionId?: Uuid;
  supplierContragentId?: Uuid;
  supplierContragentName?: string;
  supplierContragent?: ContragentShortInfo;
  userId?: Uuid;
  vatPercent: number;
  isMinPrice?: boolean;
  isWinner?: boolean;
  documents?: RequestDocument[];
  technicalProposals?: RequestDocument[];
  status?: string;
}
