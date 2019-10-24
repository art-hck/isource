import {Uuid} from "../../../cart/models/uuid";
import { RequestDocument } from "./request-document";
import { ManufacturingDocument } from './manufacturing-document';
import {RequestPositionList} from "./request-position-list";
import {RequestOfferPosition} from "./request-offer-position";

export class RequestPosition extends RequestPositionList {
  /**
   * Значение null допустимо для позиций не сохранённых в базе данных
   */

  number: number;
  type: string;
  groupId: Uuid;
  userId: Uuid;
  contragentId: Uuid;
  productionDocument: string;
  measureUnit: string;
  quantity: number;
  deliveryDate: string;
  isDeliveryDateAsap: boolean;
  deliveryBasis: string;
  startPrice: number;
  currency: string;
  paymentTerms: string;
  relatedServices: string;
  comments: string;
  status: string;
  statusLabel: string;
  statusChangedDate: string;
  statusExpectedDate: string;
  documents: RequestDocument[];
  manufacturingDocuments: ManufacturingDocument[];
  linkedOffers: RequestOfferPosition[];
  hasProcedure: boolean;
  procedureStartDate?: Date;
  procedureEndDate?: Date;
  isDraftEntity: boolean;
  isEditingByAnotherUser: boolean;
  isDesignRequired: boolean;
  checked: boolean;
}
