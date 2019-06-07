import { Uuid } from "../../cart/models/uuid";
import {SupplierDictionaryItemAttributes} from "./supplier-dictionary-item-attributes";

export interface SupplierDictionary {
  id: Uuid;
  code: string;
  measureUnits: string;
  minPriceWithVat: number;
  offersCount: number;
  shortTitle: string;
  title: string;
  attributes: SupplierDictionaryItemAttributes[];
}
