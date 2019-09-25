import { RequestDocument } from "../request/common/models/request-document";
import { User } from "../request/common/models/user";
import { Uuid } from "../cart/models/uuid";

export class Message {
  id?: Uuid;
  user?: User;
  createdDate?: string;
  message: string;
  documents?: RequestDocument[];
}

