import {Uuid} from "../../../../cart/models/uuid";

export class ContractCreate {
  supplierId: Uuid;
  positions: Uuid[];
}
