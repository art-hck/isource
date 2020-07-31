import { AgreementsListFilter } from "../../common/models/agreements-list/agreements-list-filter";

export namespace AgreementListActions {
  export class Fetch {
    static readonly type = '[Agreement Customer] Fetch';
    constructor(public filters: AgreementsListFilter, public startFrom?: number, public pageSize?: number) {}
  }
}
