import { ButtonsProfiles } from '../enums/buttons-profiles';
import { OrderStatus } from '../enums/order-statuses';

export const CustomerButtonProfileTypes: {[key: string]: string} = {};

CustomerButtonProfileTypes[OrderStatus.PUBLISHED] = ButtonsProfiles.SEND;
CustomerButtonProfileTypes[OrderStatus.WAIT_FOR_CUSTOMER_CONFIRM] = ButtonsProfiles.ACCEPT_AND_CANCEL;
