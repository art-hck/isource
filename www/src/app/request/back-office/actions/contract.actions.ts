import { Uuid } from "../../../cart/models/uuid";
import { RequestPosition } from "../../common/models/request-position";

export namespace ContractActions {

  // Добавить договор
  export class AddContract {
    static readonly type = '[Contract Backoffice] AddContract';

    constructor(
      public requestId: Uuid,
      public contragentId: Uuid,
      public positions: RequestPosition[]) {
    }
  }
  //Получение контрагентов со списком позиций
  export class GetContragents {
    static readonly type = '[Contract Contragents Backoffice] GetContragents';

    constructor(public requestId: Uuid) {
    }
  }
}
