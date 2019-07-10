import {Contract} from "./contract";
import {Uuid} from "../../../cart/models/uuid";

export class RequestContract extends Contract {
  createdDate: string;
  customerContragentId: Uuid;
  id: Uuid;
  lotId: Uuid;
  requestId: Uuid;
  requestOfferPositionId: Uuid;
  requestOfferPositionWinnerId: Uuid;
  requestPositionId: Uuid;
  supplierContragentId: Uuid;
}
