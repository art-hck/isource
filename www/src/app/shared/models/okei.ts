export class Okei {
  id: number;
  code: string;
  businessStatus: number;
  name: string;
  symbol: string|null;

  constructor(params?: Partial<Okei>) {
    Object.assign(this, params);
  }
}
