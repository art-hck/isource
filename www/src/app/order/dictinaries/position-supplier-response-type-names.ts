import { PositionSupplierResponseTypes } from '../enums/position-supplier-response-types';

export const PositionSupplierResponseTypeNames: {[key: string]: string} = {};

PositionSupplierResponseTypeNames[PositionSupplierResponseTypes.IN_STOCK] = 'В наличии';
PositionSupplierResponseTypeNames[PositionSupplierResponseTypes.OUT_OF_STOCK] = 'Отсутствует';
