import { Uuid } from "../../../cart/models/uuid";

export namespace CommercialProposals {

  // Скачать аналитическую справку
  export class DownloadAnalyticalReport {
    static readonly type = '[Commercial Proposals Backoffice] DownloadAnalyticalReport';

    constructor(public requestId: Uuid) {}
  }
}
