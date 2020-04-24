import {Uuid} from "../../../cart/models/uuid";
import { BaseModel } from "../../../core/models/base-model";
import { Request } from "./request";
import { RequestPositionListEntityType } from "../enum/request-position-list-entity-type";

export class RequestPositionList extends BaseModel {
  /**
   * Значение null допустимо для позиций не сохранённых в базе данных
   */
  id: Uuid|null;
  entityType?: RequestPositionListEntityType;
  createdDate: string;
  updatedDate: string;
  request: Request;
  name: string;
}
