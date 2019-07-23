export class OrderFormInfo {
  deliveryDate: Date|null = null;
  isDeliveryDateAsap: boolean = false;
  deliveryBasis: string = '';
  paymentTerms: string = '30 банковских дней по факту поставки';

  constructor(params: Partial<OrderFormInfo>) {
    Object.assign(this, params);
  }
}
