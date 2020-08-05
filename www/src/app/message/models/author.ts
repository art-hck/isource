import { Uuid } from "../../cart/models/uuid";

export class Author {
  firstName: string;
  fullName: string;
  lastName: string;
  login: string;
  pictureUrl: string;
  uid: Uuid;
}
