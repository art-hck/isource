import {Uuid} from "../../cart/models/uuid";

export class PositionsList {
  createdDate: string;
  currency: string;
  description: string;
  id: Uuid;
  image: string;
  measureUnit: string;
  name: string;
  price: number;
  productionDocument: string;
  productionTime: number;
  supplierContragentName: string;
}
