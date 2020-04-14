import { Uuid } from "../../../cart/models/uuid";

export class KimCartItem {
  id: Uuid;
  name: string;
  measureUnits: string;
  positionCode: string;
  price?: number;
  quantity: number;
}
