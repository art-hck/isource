import {Uuid} from "../../../cart/models/uuid";
import { RequestDocument } from "./request-document";

export class RequestOfferPosition {
  comments: string;
  createdDate: string;
  customerContragentId: string;
  deliveryDate: string;
  id: Uuid;
  paymentTerms: string;
  priceWithVat: number;
  priceWithoutVat: number;
  quantity: number;
  currency: string;
  measureUnit: string;
  requestId: Uuid;
  requestLotId: Uuid;
  requestPositionId: Uuid;
  supplierContragentId: Uuid;
  supplierContragentName: string;
  userId: Uuid;
  vatPercent: number;
  isMinPrice: boolean;
  isWinner: boolean;
  documents: RequestDocument[];
  technicalProposals: RequestDocument[];
}
