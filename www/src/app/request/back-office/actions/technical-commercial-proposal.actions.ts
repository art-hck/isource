import { Uuid } from "../../../cart/models/uuid";
import { TechnicalCommercialProposal } from "../../common/models/technical-commercial-proposal";
import { TechnicalCommercialProposalByPosition } from "../../common/models/technical-commercial-proposal-by-position";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";
import { TechnicalCommercialProposalPosition } from "../../common/models/technical-commercial-proposal-position";

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

    constructor(public requestId: Uuid, public groupId: Uuid, public update = false) {}
  }

  // Обновить список доступных к процедур из ТКП
  // @TODO: выпилить когда бэк научится отдавать процедуру при создании/уторговывании/продлении
  export class RefreshProcedures implements FetchProcedures {
    static readonly type = '[Technical Commercial Proposals Backoffice] UpdateProcedures';
    update = true;

    constructor(public requestId: Uuid, public groupId: Uuid) {}
  }

  // Создать ТКП
  export class Create {
    static readonly type = '[Technical Commercial Proposals Backoffice] Create';

    constructor(
      public requestId: Uuid,
      public groupId: Uuid,
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

  // Редактировать общие параметры ТКП
  export class UpdateParams {
    static readonly type = '[Technical Commercial Proposals Backoffice] UpdateParams';

    constructor(
      public requestId: Uuid,
      public payload: Partial<TechnicalCommercialProposal> & { id: Uuid }
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

    constructor(public proposalsByPositions: TechnicalCommercialProposalByPosition[]) {}
  }

  // Создать ТКП из шаблона
  export class UploadTemplate {
    static readonly type = '[Technical Commercial Proposals Backoffice] UploadTemplate';

    constructor(public requestId: Uuid, public groupId: Uuid, public files: File[], public groupName?: string) {}
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

  // Создать пустое ТКП (только контрагент)
  export class CreateContragent implements Create {
    static readonly type = '[Technical Commercial Proposals Backoffice] CreateContragent';
    public publish = false;

    constructor(
      public requestId: Uuid,
      public groupId: Uuid,
      public payload: Partial<TechnicalCommercialProposal> & {supplier: ContragentShortInfo}
    ) {}
  }

  // Добавить позиции в ТКП
  export class CreatePosition implements Update {
    static readonly type = '[Technical Commercial Proposals Backoffice] CreatePosition';
    publish = false;

    constructor(public payload: Partial<TechnicalCommercialProposal> & { id: Uuid; positions: TechnicalCommercialProposalPosition[] }) {
    }
  }

  // Откатить ТКП
  export class Rollback {
    static readonly type = '[Technical Commercial Proposals Backoffice] Rollback';

    constructor(public requestId: Uuid, public positionId: Uuid) {}
  }
}
