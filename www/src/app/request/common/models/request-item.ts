import {LinkedOffers} from "./linked-offers";
import {Uuid} from "../../../cart/models/uuid";

export class RequestItem {
  id: Uuid;
  name: string;
  productionDocument: string;
  measureUnit: string;
  quantity: string;
  deliveryDate: string;
  isDeliveryDateAsap: boolean;
  deliveryBasis: string;
  startPrice?: number;
  currency?: string;
  paymentTerms: string;
  relatedServices?: string;
  comments?: string;
  linkedOffers: LinkedOffers[];
}
