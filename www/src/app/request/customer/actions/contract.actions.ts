import { Uuid } from "../../../cart/models/uuid";

export namespace ContractActions {
  export class Fetch {
    static readonly type = '[Contract Customer] Fetch';
    constructor(public requestId: Uuid) {}
  }

  export class Reject {
    static readonly type = '[Contract Customer] Reject';
    constructor(public requestId: Uuid, public contractId: Uuid, public file?: File, public comment?: string) {}
  }

  export class Approve {
    static readonly type = '[Contract Customer] Approve';
    constructor(public requestId: Uuid, public contractId: Uuid) {}
  }

  export class Upload {
    static readonly type = '[Contract Customer] Upload';
    constructor(public requestId: Uuid, public contractId: Uuid, public file: File, public comment?: string) {}
  }

  export class Download {
    static readonly type = '[Contract Customer] Download';
    constructor(public requestId: Uuid, public contractId: Uuid) {}
  }
}
