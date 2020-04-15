import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalByPosition } from "../../common/models/technical-commercial-proposal-by-position";

export namespace TechnicalCommercialProposals {
  // Получить список ТКП
  export class Fetch {
    static readonly type = '[Technical Commercial Proposals Backoffice] Fetch';

    constructor(public requestId: Uuid) {}
  }

  // Получить список доступных к добавлению позиций ТКП
  export class FetchAvailablePositions {
    static readonly type = '[Technical Commercial Proposals Backoffice] FetchAvailablePositions';

    constructor(public requestId: Uuid) {}
  }

  // Создать ТКП
  export class Create {
    static readonly type = '[Technical Commercial Proposals Backoffice] Create';

    constructor(
      public requestId: Uuid,
      public payload: Partial<TechnicalCommercialProposal>,
      public publish: boolean
    ) {}
  }

  // Редактировать ТКП
  export class Update {
    static readonly type = '[Technical Commercial Proposals Backoffice] Update';

    constructor(
      public payload: Partial<TechnicalCommercialProposal> & { id: Uuid },
      public publish: boolean
    ) {}
  }

  // Отправить на согласование ТКП
  export class Publish {
    static readonly type = '[Technical Commercial Proposals Backoffice] Publish';

    constructor(public proposal: TechnicalCommercialProposal) {}
  }

  // Отправить на согласование ТКП по определенной позиции
  export class PublishByPosition {
    static readonly type = '[Technical Commercial Proposals Backoffice] PublishPositions';

    constructor(public proposalGroupByPositions: TechnicalCommercialProposalByPosition[]) {}
  }

  export class UploadTemplate {
    static readonly type = '[Technical Commercial Proposals Backoffice] UploadTemplate';

    constructor(public requestId: Uuid, public files: File[]) {}
  }

  export class DownloadTemplate {
    static readonly type = '[Technical Commercial Proposals Backoffice] DownloadTemplate';

    constructor(public requestId: Uuid) {}
  }
}
