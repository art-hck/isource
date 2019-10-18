import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "./request-position";
import { RequestOfferPosition } from "./request-offer-position";

export class Winner  {
  id: Uuid;
  offerPosition: RequestOfferPosition;
}
