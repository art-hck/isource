import { Uuid } from "../../../cart/models/uuid";
import { Request } from "../../common/models/request";
import { RequestPosition } from "../../common/models/request-position";
import { RequestOfferPosition } from "../../common/models/request-offer-position";

export namespace CommercialProposalsActions {

  // Получить КП
  export class Fetch {
    static readonly type = '[Commercial Proposals Backoffice] Fetch';
    update = false;

    constructor(public requestId: Uuid) {}
  }

  // Получить процедуры КП
  export class FetchProcedures {
    static readonly type = '[Commercial Proposals Backoffice] FetchProcedures';
    update = false;

    constructor(public requestId: Uuid) {}
  }

  // Получить процедуры КП
  export class RefreshProcedures implements FetchProcedures {
    static readonly type = '[Commercial Proposals Backoffice] RefreshProcedures';
    update = true;

    constructor(public requestId: Uuid) {}
  }

  // Обновить КП
  export class Refresh implements Fetch {
    static readonly type = '[Commercial Proposals Backoffice] Update';
    update = true;

    constructor(public requestId: Uuid) {}
  }

  // Отправить позиции на согласование
  export class AddSupplier {
    static readonly type = '[Commercial Proposals Backoffice] AddSupplier';

    constructor(public requestId: Uuid, public supplierId: Uuid) {}
  }

  // Отправить позиции на согласование
  export class SaveProposal {
    static readonly type = '[Commercial Proposals Backoffice] AddProposal';

    constructor(public requestId: Uuid, public positionId: Uuid, public proposal: RequestOfferPosition) {}
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

    constructor(public request: Request) {}
  }

  // Откатить КП
  export class Rollback {
    static readonly type = '[Commercial Proposals Backoffice] Rollback';

    constructor(public requestId: Uuid, public positionId: Uuid) {}
  }

  // Загрузить шаблон
  export class UploadTemplate {
    static readonly type = '[Commercial Proposals Backoffice] UploadTemplate';

    constructor(public requestId: Uuid, public files: File[]) {}
  }
}
