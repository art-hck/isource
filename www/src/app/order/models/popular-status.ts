export class PopularStatus {
  name: string;
  ordersCount: number;

  constructor(params?: Partial<PopularStatus>) {
    Object.assign(this, params);
  }
}
