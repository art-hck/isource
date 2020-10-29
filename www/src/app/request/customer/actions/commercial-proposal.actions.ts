import { Uuid } from "../../../cart/models/uuid";
import { CommercialProposalReviewBody } from "../../common/models/commercial-proposal-review-body";

export namespace CommercialProposals {
  // Получить список КП
  export class Fetch {
    static readonly type = '[Commercial Proposals Customer] Fetch';
    update = false;
    constructor(public requestId: Uuid, public groupId: Uuid) {}
  }

  // Обновить список КП
  export class Update implements Fetch {
    static readonly type = '[Commercial Proposals Customer] Update';
    update = true;

    constructor(public requestId: Uuid, public groupId: Uuid) {}
  }

  // Рассмотреть КП по позиции
  export class Review {
    static readonly type = '[Commercial Proposals Customer] Review';
    constructor(public requestId: Uuid, public groupId: Uuid, public body: CommercialProposalReviewBody) {}
  }

  // Скачать аналитическую справку
  export class DownloadAnalyticalReport {
    static readonly type = '[Commercial Proposals Customer] DownloadAnalyticalReport';

    constructor(public requestId: Uuid, public groupId: Uuid) {}
  }
}
