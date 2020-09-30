import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";

export namespace ContractActions {
  // Получить список
  export class Fetch {
    static readonly type = '[Contract Backoffice] Fetch';

    constructor(public requestId: Uuid) {}
  }

  // Получение доступных контрагентов со списком позиций
  export class FetchSuppliers {
    static readonly type = '[Contract Backoffice] FetchSuppliers';

    constructor(public requestId: Uuid) {}
  }

  // Добавить договор
  export class Create {
    static readonly type = '[Contract Backoffice] Create';

    constructor(public requestId: Uuid, public contragentId: Uuid, public positions: RequestPosition[]) {}
  }

  // Отправить на согласование
  export class Send {
    static readonly type = '[Contract Backoffice] Send';

    constructor(public requestId: Uuid, public contractId: Uuid, public file?: File, public comment?: string) {}
  }

  // Подписать
  export class Sign {
    static readonly type = '[Contract Backoffice] Sign';

    constructor(public contractId: Uuid) {}
  }

  // Откатить
  export class Rollback {
    static readonly type = '[Contract Backoffice] Rollback';

    constructor(public contractId: Uuid) {}
  }

  // Прикрепить файл договора
  export class Upload {
    static readonly type = '[Contract Backoffice] Upload';
    constructor(public requestId: Uuid, public contractId: Uuid, public file: File, public comment?: string) {}
  }

  // Скачать типовой договор
  export class Download {
    static readonly type = '[Contract Backoffice] Download';
    constructor(public requestId: Uuid, public contractId: Uuid) {}
  }
}
