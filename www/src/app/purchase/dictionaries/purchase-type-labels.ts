import { PurchaseTypes } from '../enums/purchase-types';

export const PurchaseTypeLabels: {[key: string]: string} = {};

PurchaseTypeLabels[PurchaseTypes.REQUIREMENT] = 'Потребность';
PurchaseTypeLabels[PurchaseTypes.PROCEDURE] = 'Процедура';
