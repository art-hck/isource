import { Uuid } from "../../../cart/models/uuid";
import { CommonProposal, CommonProposalByPosition, CommonProposalItem } from "../../common/models/common-proposal";

export namespace CommercialProposalsActions {
  export class Fetch {
    static readonly type = '[Commercial Proposals Backoffice] Fetch';

    constructor(public requestId: Uuid, public groupId: Uuid) {}
  }

  // Получить доступные к добавлению позиции
  export class FetchAvailablePositions {
    static readonly type = '[Commercial Proposals Backoffice] FetchAvailablePositions';

    constructor(public requestId: Uuid, public groupId?: Uuid) {}
  }

  // Получить процедуры КП
  export class FetchProcedures {
    static readonly type = '[Commercial Proposals Backoffice] FetchProcedures';
    update = false;

    constructor(public requestId: Uuid, public groupId?: Uuid) {}
  }


  // Обновить процедуры КП
  export class RefreshProcedures implements FetchProcedures {
    static readonly type = '[Commercial Proposals Backoffice] RefreshProcedures';
    update = true;

    constructor(public requestId: Uuid, public groupId?: Uuid) {}
  }

  // Создать ТКП
  export class Create {
    static readonly type = '[Commercial Proposals Backoffice] Create';

    constructor(
      public requestId: Uuid,
      public groupId: Uuid,
      public payload: Partial<CommonProposal>
    ) {}
  }

  // Редактировать ТКП
  export class Update {
    static readonly type = '[Commercial Proposals Backoffice] Update';

    constructor(public groupId: Uuid, public payload: Partial<CommonProposal> & { id: Uuid }) {}
  }

  // Отправить на согласование ТКП по позиции
  export class Publish {
    static readonly type = '[Commercial Proposals Backoffice] Publish';

    constructor(public groupId: Uuid, public proposalsByPositions: CommonProposalByPosition[]) {}
  }

  // Создать ТКП из шаблона
  export class UploadTemplate {
    static readonly type = '[Commercial Proposals Backoffice] UploadTemplate';

    constructor(public requestId: Uuid, public files: File[], public groupId: Uuid, public groupName?: string) {}
  }

  // Скачать шаблон
  export class DownloadTemplate {
    static readonly type = '[Commercial Proposals Backoffice] DownloadTemplate';

    constructor(public requestId: Uuid, public groupId?: Uuid) {}
  }

  // Скачать аналитическую справку
  export class DownloadAnalyticalReport {
    static readonly type = '[Commercial Proposals Backoffice] DownloadAnalyticalReport';

    constructor(public requestId: Uuid, public groupId: Uuid) {}
  }

  // Добавить позиции в ТКП
  export class CreateItems {
    static readonly type = '[Commercial Proposals Backoffice] CreateItems';
    update = false;

    constructor(public proposalId: Uuid, public groupId: Uuid, public items: Partial<CommonProposalItem>[]) {}
  }

  // Изменить позиции в ТКП
  export class UpdateItems {
    static readonly type = '[Commercial Proposals Backoffice] UpdateItems';
    update = true;

    constructor(public proposalId: Uuid, public groupId: Uuid, public items: (Partial<CommonProposalItem>)[]) {}
  }

  // Откатить ТКП
  export class Rollback {
    static readonly type = '[Commercial Proposals Backoffice] Rollback';

    constructor(public requestId: Uuid, public groupId: Uuid, public positionId: Uuid) {}
  }
}
