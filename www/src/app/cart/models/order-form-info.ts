export class OrderFormInfo {
  dateDelivery: Date|null = null;
  address = '';
  dateResponse: Date|null = null;
  comment = '';

  constructor(params: Partial<OrderFormInfo>) {
    Object.assign(this, params);
  }

  checkFill(): boolean {
    return Boolean(
      isFinite(Number(this.dateDelivery)) &&
      this.address.length > 0 &&
      isFinite(Number(this.dateResponse))
    );
  }
}
