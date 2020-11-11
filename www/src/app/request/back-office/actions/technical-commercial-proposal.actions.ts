import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { CommonProposal, CommonProposalByPosition, CommonProposalItem } from "../../common/models/common-proposal";

export namespace TechnicalCommercialProposals {
  // Получить список ТКП
  export class Fetch {
    static readonly type = '[Technical Commercial Proposals Backoffice] Fetch';

    constructor(public requestId: Uuid, public groupId: Uuid) {}
  }

  // Получить список доступных к добавлению позиций ТКП
  export class FetchAvailablePositions {
    static readonly type = '[Technical Commercial Proposals Backoffice] FetchAvailablePositions';

    constructor(public requestId: Uuid, public groupId?: Uuid) {}
  }

  // Получить список доступных к процедур из ТКП
  export class FetchProcedures {
    static readonly type = '[Technical Commercial Proposals Backoffice] FetchProcedures';

    constructor(public requestId: Uuid, public groupId?: Uuid, public update = false) {}
  }

  // Обновить список доступных к процедур из ТКП
  // @TODO: выпилить когда бэк научится отдавать процедуру при создании/уторговывании/продлении
  export class RefreshProcedures implements FetchProcedures {
    static readonly type = '[Technical Commercial Proposals Backoffice] UpdateProcedures';
    update = true;

    constructor(public requestId: Uuid, public groupId?: Uuid) {}
  }

  // Создать ТКП
  export class Create {
    static readonly type = '[Technical Commercial Proposals Backoffice] Create';

    constructor(
      public requestId: Uuid,
      public groupId: Uuid,
      public payload: Partial<CommonProposal>
    ) {}
  }

  // Редактировать ТКП
  export class Update {
    static readonly type = '[Technical Commercial Proposals Backoffice] Update';

    constructor(public groupId: Uuid, public payload: Partial<CommonProposal> & { id: Uuid }) {}
  }

  // Отправить на согласование ТКП по позиции
  export class Publish {
    static readonly type = '[Technical Commercial Proposals Backoffice] Publish';

    constructor(public groupId: Uuid, public proposalsByPositions: CommonProposalByPosition[]) {}
  }

  // Создать ТКП из шаблона
  export class UploadTemplate {
    static readonly type = '[Technical Commercial Proposals Backoffice] UploadTemplate';

    constructor(public requestId: Uuid, public files: File[], public groupId: Uuid, public groupName?: string) {}
  }

  // Скачать шаблон
  export class DownloadTemplate {
    static readonly type = '[Technical Commercial Proposals Backoffice] DownloadTemplate';

    constructor(public requestId: Uuid, public groupId?: Uuid) {}
  }

  // Скачать аналитическую справку
  export class DownloadAnalyticalReport {
    static readonly type = '[Technical Commercial Proposals Backoffice] DownloadAnalyticalReport';

    constructor(public requestId: Uuid, public groupId: Uuid) {}
  }

  // Добавить позиции в ТКП
  export class CreateItems {
    static readonly type = '[Technical Commercial Proposals Backoffice] CreateItems';
    update = false;

    constructor(public proposalId: Uuid, public groupId: Uuid, public items: Partial<CommonProposalItem>[]) {}
  }

  // Изменить позиции в ТКП
  export class UpdateItems {
    static readonly type = '[Technical Commercial Proposals Backoffice] UpdateItems';
    update = true;

    constructor(public proposalId: Uuid, public groupId: Uuid, public items: (Partial<CommonProposalItem>)[]) {}
  }

  // Откатить ТКП
  export class Rollback {
    static readonly type = '[Technical Commercial Proposals Backoffice] Rollback';

    constructor(public requestId: Uuid, public groupId: Uuid, public positionId: Uuid) {}
  }
}
