import { Guid } from "guid-typescript";
import { KimDictionaryItem } from "../../common/models/kim-dictionary-item";

export const KimDictionaryItemsMock: KimDictionaryItem[] = [
  {
    id: Guid.create().toString(),
    dictionaryPositionName: "Позиция 1 Позиция 1 Позиция 1 Позиция 1 Позиция 1 Позиция 1 Позиция 1 Позиция 1 Позиция 1 Позиция 1 Позиция 1 Позиция 1 Позиция" +
      " 1 Позиция 1",
    measureUnits: 'шт',
    dictionaryPositionId: 123455,
    dictionaryPositionCategoryCode: '12.34.555',
    dictionaryPositionCategoryName: 'Категория 1 стандарт Категория 1 стандарт Категория 1 стандарт Категория 1 стандарт Категория 1 стандарт',
  },
  {
    id: Guid.create().toString(),
    dictionaryPositionName: "Позиция 2",
    measureUnits: 'шт',
    dictionaryPositionId: 123455,
    dictionaryPositionCategoryCode: '12.34.555',
    dictionaryPositionCategoryName: 'Категория 2 стандарт'
  },
  {
    id: Guid.create().toString(),
    dictionaryPositionName: "Позиция 2",
    measureUnits: 'шт',
    dictionaryPositionId: 123455,
    dictionaryPositionCategoryCode: '12.34.555',
    dictionaryPositionCategoryName: 'Категория Позиция 2'
  },
  {
    id: Guid.create().toString(),
    dictionaryPositionName: "Позиция 3",
    measureUnits: 'шт',
    dictionaryPositionId: 123455,
    dictionaryPositionCategoryCode: '12.34.555',
    dictionaryPositionCategoryName: 'Категория 3 стандарт'
  },
];
