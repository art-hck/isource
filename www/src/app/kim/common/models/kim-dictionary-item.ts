import { Uuid } from "../../../cart/models/uuid";

export class KimDictionaryItem {
  id: Uuid;
  dictionaryPositionName: string;
  measureUnits: string;
  dictionaryPositionId: number;
  dictionaryPositionCategoryCode: string;
  dictionaryPositionCategoryName: string;
}
