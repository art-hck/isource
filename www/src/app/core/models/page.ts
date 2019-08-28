export class Page<T> {
  totalCount: number;
  entities: Array<T>;

  constructor(entities: Array<T>, totalCount: number) {
    this.totalCount = totalCount;
    this.entities = entities;
  }
}
