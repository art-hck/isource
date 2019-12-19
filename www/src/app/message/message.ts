import { RequestDocument } from "../request/common/models/request-document";
import { User } from "../user/models/user";
import { Uuid } from "../cart/models/uuid";

export class Message {
  id?: Uuid;
  user?: User;
  createdDate?: string;
  message: string;
  documents?: RequestDocument[];
}

