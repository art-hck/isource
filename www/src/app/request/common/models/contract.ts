import { Uuid } from "../../../cart/models/uuid";
import { RequestDocument } from "./request-document";
import { RequestPosition } from "./request-position";
import { ContragentList } from "../../../contragent/models/contragent-list";

export class Contract {
  id: Uuid;
  documents: RequestDocument[];
  positions: RequestPosition[];
  contragent: ContragentList;
  totalPrice: number;
}
