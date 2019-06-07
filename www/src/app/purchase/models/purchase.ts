import {Uuid} from "../../cart/models/uuid";
import {Lot} from "./lot";

export interface Purchase {
  id: Uuid;
  type?: string; // todo убрать знак вопроса
  typeName: string;
  number: string;
  creationDate: Date;
  title: string;
  positionsCount?: number;
  startMaxCost?: number;
  lots?: Lot[];
  isAnalogAllowed?: boolean;
}
