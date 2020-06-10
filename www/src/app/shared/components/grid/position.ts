export class Position<T = any> {
  isDeliveryDateAsap?: boolean;
  deliveryDate: string;
  quantity: number;

  constructor(sourcePosition: T, toPositionFn: (sourcePosition: T) => Position<T>) {
    Object.assign(this, (toPositionFn && toPositionFn(sourcePosition)) ?? sourcePosition);
  }
}
