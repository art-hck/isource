import { PositionInfoField } from "../enum/position-info-field";

export const PositionInfoFieldsLabels: {[key in PositionInfoField]: string} = {
  [PositionInfoField.CURRENCY]: 'Валюта',
  [PositionInfoField.DELIVERY_BASIS]: 'Базис поставки',
  [PositionInfoField.DELIVERY_DATE]: 'Дата поставки',
  [PositionInfoField.IS_DELIVERY_DATE_ASAP]: 'Срочная поставка',
  [PositionInfoField.MEASURE_UNIT]: 'Единица измерения',
  [PositionInfoField.NAME]: 'Наименование позиции',
  [PositionInfoField.PRODUCTION_DOCUMENT]: 'Документ изготовления',
  [PositionInfoField.QUANTITY]: 'Количество',
  [PositionInfoField.START_PRICE]: 'Начальная максимальная цена',
  [PositionInfoField.RELATED_SERVICES]: 'Необходимость сопутствующих услуг',
  [PositionInfoField.COMMENTS]: 'Дополнительные требования',
};

