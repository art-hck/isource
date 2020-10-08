import { Uuid } from "../../../cart/models/uuid";
import { Contract } from "../../common/models/contract";

export namespace ContractActions {
  export class Fetch {
    static readonly type = '[Contract Customer] Fetch';
    constructor(public requestId: Uuid) {}
  }

  export class Reject {
    static readonly type = '[Contract Customer] Reject';
    constructor(public contract: Contract, public files?: File[], public comment?: string) {}
  }

  export class Approve {
    static readonly type = '[Contract Customer] Approve';
    constructor(public contract: Contract) {}
  }

  export class Upload {
    static readonly type = '[Contract Customer] Upload';
    constructor(public contract: Contract, public files: File[], public comment?: string) {}
  }

  export class Download {
    static readonly type = '[Contract Customer] Download';
    constructor(public contract: Contract) {}
  }
}
