import { Uuid } from "../../../cart/models/uuid";

export namespace RequestActions {
  export class Fetch {
    static readonly type = '[Request Customer] Fetch';
    constructor(public requestId: Uuid, public useCache = true, public clearState = true) {}
  }

  export class Refresh {
    static readonly type = '[Request Customer] Refresh';
    constructor(public requestId: Uuid) {}
  }

  export class FetchPositions {
    static readonly type = '[Request Customer] Fetch Positions';
    constructor(public requestId: Uuid, public useCache = true, public clearState = true) {}
  }

  export class RefreshPositions {
    static readonly type = '[Request Customer] Refresh Positions';
    constructor(public requestId: Uuid) {}
  }

  export class Publish {
    static readonly type = '[Request Customer] Publish';
    constructor(public requestId: Uuid, public refresh = true) {}
  }

  export class Approve {
    static readonly type = '[Request Customer] Approve';
    constructor(public requestId: Uuid) {}
  }

  export class Reject {
    static readonly type = '[Request Customer] Reject';
    constructor(public requestId: Uuid) {}
  }

  export class UploadFromTemplate {
    static readonly type = '[Request Customer] Upload From Template';
    constructor(public requestId: Uuid, public files: File[]) {}
  }
}
