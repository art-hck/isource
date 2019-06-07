import {Item} from './item';
import { Uuid } from './uuid';

export class Supplier {
  name: string;
  id: Uuid;
  items: Item[];

  constructor(params?: Partial<Supplier>) {
    Object.assign(this, params);
  }

  getSum(): number {
    let sum = 0;
    for (const item of this.items) {
      sum += item.getSum();
    }
    return sum;
  }
}
