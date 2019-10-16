import { Contragent } from "../../../core/models/contragent";
import { RequestPosition } from "./request-position";
import { ContragentList } from "../../../contragent/models/contragent-list";

export class ContragentWithPositions {
  contragent: ContragentList;
  positions: RequestPosition[];
}
