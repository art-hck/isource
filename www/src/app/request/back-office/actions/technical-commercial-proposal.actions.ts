import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";

export namespace TechnicalCommercialProposals {
  // Получить список ТКП
  export class Fetch {
    static readonly type = '[Technical Commercial Proposals] Fetch';
    constructor(public requestId: Uuid) {}
  }

  // Создать ТКП
  export class Create {
    static readonly type = '[Technical Commercial Proposals] Create';
    constructor(public requestId: Uuid, public payload: Partial<TechnicalCommercialProposal>) {}
  }

  // Редактировать ТКП
  export class Update {
    static readonly type = '[Technical Commercial Proposals] Update';
    constructor(public requestId: Uuid, public payload: Partial<TechnicalCommercialProposal> & {id: Uuid}) {}
  }
}
