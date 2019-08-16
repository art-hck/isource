import {Uuid} from "../../../cart/models/uuid";

export class RequestPositionList {
  /**
   * Значение null допустимо для позиций не сохранённых в базе данных
   */
  id: Uuid|null;
  entityType?: string;
  createdDate: string;
  requestId: Uuid;
  name: string;
}
