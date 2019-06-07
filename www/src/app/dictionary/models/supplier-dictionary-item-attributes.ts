import { Uuid } from "../../cart/models/uuid";

export interface SupplierDictionaryItemAttributes {
  id: Uuid;
  attributeId: string;
  title: string;
  type: string;
  isRequired: boolean;
  hasDictionary: boolean;
  measureUnit: string;
  value: string;
}
