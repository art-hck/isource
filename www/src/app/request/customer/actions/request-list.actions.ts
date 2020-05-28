import { RequestsListFilter } from "../../common/models/requests-list/requests-list-filter";

export namespace RequestListActions {
  export class Fetch {
    static readonly type = '[Request List Customer] Fetch';

    constructor(public startFrom: number, public pageSize: number, public filters: RequestsListFilter = {}) {}
  }

  export class AddRequestFromExcel {
    static readonly type = '[Request List Customer] Add Request From Excel';

    constructor(public files: File[], public requestName: string, public publish: boolean) {
    }
  }
}
