import { Uuid } from "../../../cart/models/uuid";
import { PositionFilter } from "../../common/models/position-filter";

export namespace RequestActions {
  export class Fetch {
    static readonly type = '[Request Approver] Fetch';
    constructor(public requestId: Uuid, public useCache = true, public clearState = true) {}
  }

  export class Refresh {
    static readonly type = '[Request Approver] Refresh';
    constructor(public requestId: Uuid) {}
  }

  export class FetchPositions {
    static readonly type = '[Request Approver] Fetch Positions';
    constructor(public requestId: Uuid, public filter?: PositionFilter, public useCache = true, public clearState = true) {}
  }

  export class RefreshPositions {
    static readonly type = '[Request Approver] Refresh Positions';
    constructor(public requestId: Uuid, public filter?: PositionFilter) {}
  }

  export class ApprovePositions {
    static readonly type = '[Request Approver] ApprovePositions';
    constructor(public requestId: Uuid, public positionIds: Uuid[]) {}
  }

  export class RejectPositions {
    static readonly type = '[Request Approver] RejectPositions';
    constructor(public requestId: Uuid, public positionIds: Uuid[], public rejectionMessage: string) {}
  }

  export class PublishPositions {
    static readonly type = '[Request Approver] PublishPositions';
    constructor(public requestId: Uuid, public positionIds: Uuid[]) {}
  }

  export class CancelPositions {
    static readonly type = '[Request Approver] CancelPositions';
    constructor(public requestId: Uuid, public positionIds: Uuid[], public rejectionMessage: string) {}
  }
}
