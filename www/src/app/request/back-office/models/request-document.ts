import {Uuid} from "../../../cart/models/uuid";
import {User} from "../../common/models/user";

export class RequestDocument {
  id: Uuid;
  user: User;
  created: string;
  filename: string;
}
