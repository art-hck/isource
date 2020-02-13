import { PositionInfoFields } from "../enum/position-info-fields";

export const PositionInfoFieldsLabels: {[key: string]: string} = {
  [PositionInfoFields.CURRENCY]: 'Валюта',
  [PositionInfoFields.DELIVERY_BASIS]: 'Базис поставки',
  [PositionInfoFields.DELIVERY_DATE]: 'Дата поставки',
  [PositionInfoFields.IS_DELIVERY_DATE_ASAP]: 'Срочная поставка',
  [PositionInfoFields.MEASURE_UNIT]: 'Единица измерения',
  [PositionInfoFields.NAME]: 'Наименование позиции',
  [PositionInfoFields.PRODUCTION_DOCUMENT]: 'Документ изготовления',
  [PositionInfoFields.QUANTITY]: 'Количество',
  [PositionInfoFields.START_PRICE]: 'Начальная максимальная цена',
  [PositionInfoFields.RELATED_SERVICES]: 'Необходимость сопутствующих услуг',
  [PositionInfoFields.COMMENTS]: 'Дополнительные требования',
};

