
export class RequestItem {
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
}
