import { RequestPosition } from "./request-position";
import { Uuid } from "../../../cart/models/uuid";

export class UserListRequestPosition extends RequestPosition {
  requestNumber: number;
  requestId: Uuid;
}
