import {Uuid} from "../../../cart/models/uuid";
import { RequestDocument } from "./request-document";
import { ManufacturingDocument } from './manufacturing-document';
import {RequestPositionList} from "./request-position-list";
import {RequestOfferPosition} from "./request-offer-position";
import { PositionStatus } from "../enum/position-status";
import { User } from "../../../user/models/user";
import { RequestGroup } from "./request-group";
import { PositionCurrency } from "../enum/position-currency";

export class RequestPosition extends RequestPositionList {
  /**
   * Значение null допустимо для позиций не сохранённых в базе данных
   */

  id: Uuid;
  number: number;
  type: string;
  groupId: Uuid;
  group: RequestGroup;
  userId: Uuid;
  contragentId: Uuid;
  productionDocument: string;
  measureUnit: string;
  okeiCode: number;
  quantity: number;
  deliveryDate: string;
  isDeliveryDateAsap: boolean;
  deliveryBasis: string;
  startPrice: number;
  currency: PositionCurrency;
  paymentTerms: string;
  isShmrRequired: boolean;
  isPnrRequired: boolean;
  isInProcedure: boolean;
  isInspectionControlRequired: boolean;
  comments: string;
  status: PositionStatus;
  statusLabel: string;
  statusChangedDate: string;
  statusExpectedDate: string;
  documents: RequestDocument[];
  manufacturingDocuments: ManufacturingDocument[];
  linkedOffers: RequestOfferPosition[];
  hasProcedure?: boolean;
  procedureId?: number;
  procedureLotId?: string;
  procedureTitle?: string;
  procedureStartDate?: string;
  procedureEndDate?: string;
  isDraftEntity: boolean;
  isEditingByAnotherUser: boolean;
  isDesignRequired: boolean;
  checked?: boolean;
  sourceRequestPositionId?: Uuid;
  responsibleUser?: User;
  responsibleUserId?: Uuid;
  acceptedTpCount?: number;
  nameTemplate?: string;
  availableStatuses?: string[];
  availableEditFields?: string[];
  mtrPositionId?: Uuid;
  beforeNormalizedName: string;
}
