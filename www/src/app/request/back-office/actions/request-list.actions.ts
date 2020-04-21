import { RequestsListFilter } from "../../common/models/requests-list/requests-list-filter";

export namespace RequestListActions {
  export class Fetch {
    static readonly type = '[Request List Backoffice] Fetch';
    constructor(public startFrom: number, public pageSize: number, public filters: RequestsListFilter = {}) {}
  }

  export class FetchAvailableFilters {
    static readonly type = '[Request List Backoffice] Fetch Available Filters';
  }

  export class FetchStatusCounts {
    static readonly type = '[Request List Backoffice] Fetch Status Counts';
  }
}
