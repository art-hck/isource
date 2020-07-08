import { Uuid } from "../../../cart/models/uuid";
import { Request } from "../../common/models/request";
import { RequestPosition } from "../../common/models/request-position";

export namespace CommercialProposalsActions {

  // Получить КП
  export class Fetch {
    static readonly type = '[Commercial Proposals Backoffice] Fetch';
    update = false;

    constructor(public requestId: Uuid) {}
  }

  // Обновить КП
  export class Update {
    static readonly type = '[Commercial Proposals Backoffice] Update';
    update = true;

    constructor(public requestId: Uuid) {}
  }

  // Отправить позиции на согласование
  export class PublishPositions {
    static readonly type = '[Commercial Proposals Backoffice] PublishPositions';

    constructor(public requestId: Uuid, public positions: RequestPosition[]) {}
  }

  // Скачать аналитическую справку
  export class DownloadAnalyticalReport {
    static readonly type = '[Commercial Proposals Backoffice] DownloadAnalyticalReport';

    constructor(public requestId: Uuid) {}
  }

  // Скачать шаблон
  export class DownloadTemplate {
    static readonly type = '[Commercial Proposals Backoffice] DownloadTemplate';

    constructor(public request: Request) {
    }
  }

  // Загрузить шаблон
  export class UploadTemplate {
    static readonly type = '[Commercial Proposals Backoffice] UploadTemplate';

    constructor(public requestId: Uuid, public files: File[]) {
    }
  }
}
