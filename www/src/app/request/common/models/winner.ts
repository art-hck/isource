import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "./request-position";

export class Winner  {
  id: Uuid;
  offerPosition: {
    id: Uuid,
    requestPosition: RequestPosition,
    priceWithVat: number,
    priceWithoutVat: number,
    vatPercent: number,
    currency: string,
    quantity: number,
    measureUnit: string
  };
}
