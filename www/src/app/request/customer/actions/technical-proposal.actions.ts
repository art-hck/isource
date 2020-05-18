import { Uuid } from "../../../cart/models/uuid";
import { TechnicalProposalPosition } from "../../common/models/technical-proposal-position";

export namespace TechnicalProposals {
  // Получить список ТП
  export class Fetch {
    static readonly type = '[Technical Proposals Customer] Fetch';
    constructor(public requestId: Uuid) {}
  }

  // Обновить список ТП
  export class Update {
    static readonly type = '[Technical Proposals Customer] Update';
    constructor(public requestId: Uuid) {}
  }

  // Согласовать позицию ТП
  export class Approve {
    static readonly type = '[Technical Proposals Customer] Approve';
    constructor(public requestId: Uuid, public technicalProposalId: Uuid, public proposalPosition: TechnicalProposalPosition[]) {}
  }

  // Отклонить позицию ТП
  export class Reject {
    static readonly type = '[Technical Proposals Customer] Reject';
    constructor(public requestId: Uuid, public technicalProposalId: Uuid, public proposalPosition: TechnicalProposalPosition[]) {}
  }
}
