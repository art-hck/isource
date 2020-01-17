import { PositionInfoFields } from "../enum/position-info-fields";

export const PositionInfoFieldsLabels: {[key: string]: string} = {};

PositionInfoFieldsLabels[PositionInfoFields.CURRENCY] = 'Валюта';
PositionInfoFieldsLabels[PositionInfoFields.DELIVERY_BASIS] = 'Базис поставки';
PositionInfoFieldsLabels[PositionInfoFields.DELIVERY_DATE] = 'Дата поставки';
PositionInfoFieldsLabels[PositionInfoFields.IS_DELIVERY_DATE_ASAP] = 'Срочная поставка';
PositionInfoFieldsLabels[PositionInfoFields.MEASURE_UNIT] = 'Единица измерения';
PositionInfoFieldsLabels[PositionInfoFields.NAME] = 'Наименование позиции';
PositionInfoFieldsLabels[PositionInfoFields.PRODUCTION_DOCUMENT] = 'Документ изготовления';
PositionInfoFieldsLabels[PositionInfoFields.QUANTITY] = 'Количество';
PositionInfoFieldsLabels[PositionInfoFields.START_PRICE] = 'Начальная максимальная цена';
PositionInfoFieldsLabels[PositionInfoFields.RELATED_SERVICES] = 'Необходимость сопутствующих услуг';
PositionInfoFieldsLabels[PositionInfoFields.COMMENTS] = 'Дополнительные требования';
