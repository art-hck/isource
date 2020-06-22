import { Uuid } from "../../../cart/models/uuid";

export namespace CommercialProposals {
  // Получить список КП
  export class Fetch {
    static readonly type = '[Commercial Proposals Customer] Fetch';
    update = false;
    constructor(public requestId: Uuid) {}
  }

  // Обновить список КП
  export class Update implements Fetch {
    static readonly type = '[Commercial Proposals Customer] Update';
    update = true;

    constructor(public requestId: Uuid) {}
  }

  // Согласовать позицию КП
  export class Approve {
    static readonly type = '[Commercial Proposals Customer] Approve';
    constructor(public requestId: Uuid, public positionIdsWithProposalIds: { [key in Uuid]: Uuid }) {}
  }
}
