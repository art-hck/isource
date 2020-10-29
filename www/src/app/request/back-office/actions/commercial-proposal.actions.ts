import { Uuid } from "../../../cart/models/uuid";
import { Request } from "../../common/models/request";
import { RequestPosition } from "../../common/models/request-position";
import { RequestOfferPosition } from "../../common/models/request-offer-position";

export namespace CommercialProposalsActions {

  // Получить КП
  export class Fetch {
    static readonly type = '[Commercial Proposals Backoffice] Fetch';
    update = false;

    constructor(public requestId: Uuid, public groupId: Uuid) {}
  }

  // Получить процедуры КП
  export class FetchProcedures {
    static readonly type = '[Commercial Proposals Backoffice] FetchProcedures';
    update = false;

    constructor(public requestId: Uuid, public groupId?: Uuid) {}
  }

  // Получить доступные к добавлению позиции
  export class FetchAvailablePositions {
    static readonly type = '[Commercial Proposals Backoffice] FetchAvailablePositions';

    constructor(public requestId: Uuid) {}
  }

  // Обновить процедуры КП
  export class RefreshProcedures implements FetchProcedures {
    static readonly type = '[Commercial Proposals Backoffice] RefreshProcedures';
    update = true;

    constructor(public requestId: Uuid, public groupId?: Uuid) {}
  }

  // Обновить КП
  export class Refresh implements Fetch {
    static readonly type = '[Commercial Proposals Backoffice] Update';
    update = true;

    constructor(public requestId: Uuid, public groupId: Uuid) {}
  }

  // Добавить столбец поставщика
  export class AddSupplier {
    static readonly type = '[Commercial Proposals Backoffice] AddSupplier';

    constructor(public requestId: Uuid, public groupId: Uuid, public supplierId: Uuid) {}
  }

  // Изменить/Создать КП
  export class SaveProposal {
    static readonly type = '[Commercial Proposals Backoffice] AddProposal';

    constructor(public requestId: Uuid, public positionId: Uuid, public proposal: RequestOfferPosition) {}
  }

  // Отправить позиции на согласование
  export class PublishPositions {
    static readonly type = '[Commercial Proposals Backoffice] PublishPositions';

    constructor(public requestId: Uuid, public groupId: Uuid, public positions: RequestPosition[]) {}
  }

  // Скачать аналитическую справку
  export class DownloadAnalyticalReport {
    static readonly type = '[Commercial Proposals Backoffice] DownloadAnalyticalReport';

    constructor(public requestId: Uuid, public groupId: Uuid) {}
  }

  // Скачать шаблон
  export class DownloadTemplate {
    static readonly type = '[Commercial Proposals Backoffice] DownloadTemplate';

    constructor(public requestId: Uuid, public groupId?: Uuid) {}
  }

  // Откатить КП
  export class Rollback {
    static readonly type = '[Commercial Proposals Backoffice] Rollback';

    constructor(public requestId: Uuid, public positionId: Uuid) {}
  }

  // Загрузить шаблон
  export class UploadTemplate {
    static readonly type = '[Commercial Proposals Backoffice] UploadTemplate';

    constructor(public requestId: Uuid, public files: File[], public groupId: Uuid, public groupName?: string) {}
  }
}
