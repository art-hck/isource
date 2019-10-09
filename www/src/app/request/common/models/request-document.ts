import {Uuid} from "../../../cart/models/uuid";
import {User} from "./user";

export class RequestDocument {
  id: Uuid;
  user?: User;
  created: string;
  filename: string;
  extension: string;
  mime: string;
  size: number;
  comments?: string;
}
