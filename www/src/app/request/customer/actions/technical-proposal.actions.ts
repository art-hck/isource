import { Uuid } from "../../../cart/models/uuid";
import { TechnicalProposalPosition } from "../../common/models/technical-proposal-position";
import { TechnicalProposalFilter } from "../../common/models/technical-proposal-filter";

export namespace TechnicalProposals {
  // Получить список ТП
  export class Fetch {
    static readonly type = '[Technical Proposals Customer] Fetch';
    constructor(public requestId: Uuid, public filters: TechnicalProposalFilter = {}) {}
  }

  // Обновить список ТП
  export class Update {
    static readonly type = '[Technical Proposals Customer] Update';
    constructor(public requestId: Uuid, public filters: TechnicalProposalFilter = {}) {}
  }

  // Согласовать позицию ТП
  export class Approve {
    static readonly type = '[Technical Proposals Customer] Approve';
    constructor(public requestId: Uuid, public technicalProposalId: Uuid, public proposalPosition: TechnicalProposalPosition[]) {}
  }

  // Отклонить позицию ТП
  export class Reject {
    static readonly type = '[Technical Proposals Customer] Reject';
    constructor(public requestId: Uuid, public technicalProposalId: Uuid, public proposalPosition: TechnicalProposalPosition[], public comment: string) {}
  }

  // Отправить позицию ТП на доработку
  export class SendToEdit {
    static readonly type = '[Technical Proposals Customer] SendToEdit';
    constructor(public requestId: Uuid, public technicalProposalId: Uuid, public proposalPosition: TechnicalProposalPosition[], public comment: string) {}
  }

  // Получает список доступных статусов ТП для фильтра
  export class GetFilterStatuses {
    static readonly type = '[Technical Proposals Customer] GetFilterStatuses';
    constructor(public requestId: Uuid, public filters: TechnicalProposalFilter = {}) {}
  }

}
