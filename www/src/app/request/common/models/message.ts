import { Uuid } from "../../../cart/models/uuid";
import { User } from "./user";
import { RequestDocument } from "./request-document";

export class Message {
  id?: Uuid;
  user?: User;
  createdDate?: string;
  message: string;
  documents?: RequestDocument[];
  requestPositionId?: Uuid;
}
