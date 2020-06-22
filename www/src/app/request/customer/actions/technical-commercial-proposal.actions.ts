import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposalPosition } from "../../common/models/technical-commercial-proposal-position";
import { RequestPosition } from "../../common/models/request-position";

export namespace TechnicalCommercialProposals {
  // Получить список ТКП
  export class Fetch {
    static readonly type = '[Technical Commercial Proposals Customer] Fetch';
    constructor(public requestId: Uuid) {}
  }

  // Согласовать ТКП у позиции
  export class Approve {
    static readonly type = '[Technical Commercial Proposals Customer] Approve';
    constructor(public requestId: Uuid, public proposalPosition: TechnicalCommercialProposalPosition) {}
  }

  // Согласовать ТКП у множества позиций
  export class ApproveMultiple {
    static readonly type = '[Technical Commercial Proposals Customer] ApproveMultiple';
    constructor(public proposalPositions: TechnicalCommercialProposalPosition[]) {}
  }

  // Отправить на доработку ТКП у множества позиций
  export class SendToEditMultiple {
    static readonly type = '[Technical Commercial Proposals Customer] SendToEditMultiple';
    constructor(public requestPositions: RequestPosition[]) {}
  }

  // Отклонить все предложения у определенной позиции
  export class Reject {
    static readonly type = '[Technical Commercial Proposals Customer] Reject';
    constructor(public requestId: Uuid, public position: RequestPosition) {}
  }
}
