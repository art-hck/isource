import { Uuid } from "../../../cart/models/uuid";

export namespace RequestActions {
  export class Fetch {
    static readonly type = '[Request] Fetch';
    constructor(public requestId: Uuid, public useCache = true, public resetState = true) {}
  }

  export class Refresh {
    static readonly type = '[Request] Refresh';
    constructor(public requestId: Uuid) {}
  }

  export class FetchPositions {
    static readonly type = '[Request] Fetch Positions';
    constructor(public requestId: Uuid, public useCache = true, public resetState = true) {}
  }

  export class RefreshPositions {
    static readonly type = '[Request] Refresh Positions';
    constructor(public requestId: Uuid) {}
  }

  export class Publish {
    static readonly type = '[Request] Publish';
    constructor(public requestId: Uuid, public refresh = true) {}
  }

  export class UploadFromTemplate {
    static readonly type = '[Request] Upload From Template';
    constructor(public requestId: Uuid, public files: File[]) {}
  }
}
