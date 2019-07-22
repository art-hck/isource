import { Uuid } from "../../cart/models/uuid";

export class CatalogPosition {
  id: Uuid;
  name: string;
  measureUnit: string;
  price: number;
  currency: string;
  description: string;
  image: string;
  supplierContragentName: string;
  productionDocument: string;
  productionTime: number;
  createdDate: string;
}
