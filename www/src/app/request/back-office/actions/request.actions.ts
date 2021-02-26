import { Uuid } from "../../../cart/models/uuid";
import { RequestFilters } from "../../common/models/request-filters";

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
    constructor(public requestId: Uuid, public filters: RequestFilters = {}, public useCache = true, public clearState = true) {}
  }

  export class RefreshPositions {
    static readonly type = '[Request Backoffice] Refresh Positions';
    constructor(public requestId: Uuid, public filters: RequestFilters = {}) {}
  }

  export class FetchAvailableFilters {
    static readonly type = '[Request Backoffice] Fetch Available Filters';
    constructor(public requestId: Uuid, public filters: RequestFilters = {}) {}
  }

  export class ChangeResponsibleUser {
    static readonly type = '[Request Backoffice] Change Responsible User';
    constructor(public requestId: Uuid, public userId: Uuid) {}
  }

  export class ChangeResponsibleUserPositions {
    static readonly type = '[Request Backoffice] Change Responsible User Positions';
    constructor(public requestId: Uuid, public userId: Uuid, public positionIds: Uuid[]) {}
  }

  export class EditRequestName {
    static readonly type = '[Request Backoffice] EditRequestName';
    constructor(public requestId: Uuid, public requestName: string) {}
  }

  export class Publish {
    static readonly type = '[Request Backoffice] Publish';
    constructor(public requestId: Uuid, public refresh = true, public positions: [string]) {}
  }

  export class AttachDocuments {
    static readonly type = '[Request Backoffice] AttachDocuments';
    constructor(public requestId: Uuid, public positionIds: Uuid[], public files: File[]) {}
  }

  export class UploadFromTemplate {
    static readonly type = '[Request Backoffice] Upload From Template';
    constructor(public requestId: Uuid, public files: File[]) {}
  }
}
