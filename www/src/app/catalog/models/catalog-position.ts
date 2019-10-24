import { Uuid } from "../../cart/models/uuid";
import { ContragentInfo } from "../../contragent/models/contragent-info";

export class CatalogPosition {
  id: Uuid;
  name: string;
  measureUnit: string;
  price: number;
  currency: string;
  description: string;
  image: string;
  supplierContragent: ContragentInfo;
  supplierContragentName?: string;
  supplierContragentId?: string;
  productionDocument: string;
  productionTime: number;
  createdDate: string;
}
