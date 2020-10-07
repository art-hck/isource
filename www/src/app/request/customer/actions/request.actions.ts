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

  export class PublishPositions {
    static readonly type = '[Request Customer] PublishPositions';
    constructor(public requestId: Uuid, public positionIds: Uuid[]) {}
  }

  export class ApprovePositions {
    static readonly type = '[Request Customer] ApprovePositions';
    constructor(public requestId: Uuid, public positionIds: Uuid[]) {}
  }

  export class RejectPositions {
    static readonly type = '[Request Customer] RejectPositions';
    constructor(public requestId: Uuid, public positionIds: Uuid[], public rejectionMessage: string) {}
  }

  export class Reject {
    static readonly type = '[Request Customer] Reject';
    constructor(public requestId: Uuid) {}
  }

  export class UploadFromTemplate {
    static readonly type = '[Request Customer] Upload From Template';
    constructor(public requestId: Uuid, public files: File[]) {}
  }
  export class CreateTemplate {
    static readonly type = '[Request Customer] Create Template';
    constructor(public requestId: Uuid, public positions: [string], public title: string, public tag: string) {}
  }
}
