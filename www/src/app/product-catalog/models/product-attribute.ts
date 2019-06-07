export class ProductAttribute {
  title: string;
  value: number | string | null;

  constructor(params?: Partial<ProductAttribute>) {
    Object.assign(this, params);
  }
}
