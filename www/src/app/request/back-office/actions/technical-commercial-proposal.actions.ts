import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";

export namespace TechnicalCommercialProposals {
  // Получить список ТКП
  export class Fetch {
    static readonly type = '[Technical Commercial Proposals] Fetch';
    constructor(public requestId: Uuid) {}
  }

  // Получить список доступных к добавлению позиций ТКП
  export class FetchAvailablePositions {
    static readonly type = '[Technical Commercial Proposals] FetchAvailablePositions';
    constructor(public requestId: Uuid) {}
  }

  // Создать ТКП
  export class Create {
    static readonly type = '[Technical Commercial Proposals] Create';

    constructor(
      public requestId: Uuid,
      public payload: Partial<TechnicalCommercialProposal>,
      public publish: boolean
    ) {}
  }

  // Редактировать ТКП
  export class Update {
    static readonly type = '[Technical Commercial Proposals] Update';

    constructor(
      public requestId: Uuid,
      public payload: Partial<TechnicalCommercialProposal> & { id: Uuid },
      public publish: boolean
    ) {}
  }

  // Отправить на согласование ТКП
  export class Publish {
    static readonly type = '[Technical Commercial Proposals] Publish';
    constructor(public requestId: Uuid, public proposal: TechnicalCommercialProposal) {}
  }
}
