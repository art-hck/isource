import {Uuid} from "../../../cart/models/uuid";
import { BaseModel } from "../../../core/models/base-model";
import { Request } from "./request";

export class RequestPositionList extends BaseModel {
  /**
   * Значение null допустимо для позиций не сохранённых в базе данных
   */
  id: Uuid|null;
  entityType?: string;
  createdDate: string;
  request: Request;
  name: string;
}
