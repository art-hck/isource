import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
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

  // Отклонить все предложения у определенной позиции
  export class Reject {
    static readonly type = '[Technical Commercial Proposals Customer] Reject';
    constructor(public requestId: Uuid, public position: RequestPosition) {}
  }
}
