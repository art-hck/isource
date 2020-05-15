import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";

export namespace RequestActions {
  export class Fetch {
    static readonly type = '[Request Backoffice] Fetch';
    constructor(public requestId: Uuid, public useCache = true, public clearState = true) {}
  }

  export class Refresh {
    static readonly type = '[Request Backoffice] Refresh';
    constructor(public requestId: Uuid) {}
  }

  export class FetchPositions {
    static readonly type = '[Request Backoffice] Fetch Positions';
    constructor(public requestId: Uuid, public useCache = true, public clearState = true) {}
  }

  export class RefreshPositions {
    static readonly type = '[Request Backoffice] Refresh Positions';
    constructor(public requestId: Uuid) {}
  }

  export class Publish {
    static readonly type = '[Request Backoffice] Publish';
    constructor(public requestId: Uuid, public refresh = true, public positions: [string]) {}
  }

  export class UploadFromTemplate {
    static readonly type = '[Request Backoffice] Upload From Template';
    constructor(public requestId: Uuid, public files: File[]) {}
  }
}
