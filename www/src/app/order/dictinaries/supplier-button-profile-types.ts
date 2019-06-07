import { OrderStatus } from '../enums/order-statuses';
import { ButtonsProfiles } from '../enums/buttons-profiles';

export const SupplierButtonProfileTypes: {[key: string]: string} = {};

SupplierButtonProfileTypes[OrderStatus.WAIT_FOR_SUPPLIER_CONFIRM] = ButtonsProfiles.SEND;
