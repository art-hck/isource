import { Uuid } from "../../cart/models/uuid";

export namespace Messages {
  // Получить список ТКП
  export class Fetch {
    static readonly type = '[Messages] Fetch';

    constructor(
      public role: string,
      public startFrom: number,
      public pageSize: number,
      public filters: string[],
      public sort: null
    ) {}
  }

  export class FetchPositions {
    static readonly type = '[Messages] FetchPositions';

    constructor(
      public requestId: Uuid,
      public role: string
    ) {}
  }

  export class FetchCounters {
    static readonly type = '[Messages] FetchCounters';
  }
}
