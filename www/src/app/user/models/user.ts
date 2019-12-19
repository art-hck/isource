import { Uuid } from "../../cart/models/uuid";

export class User {
  id: Uuid;
  username: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  // полное имя
  fullName?: string;
  // фамилия и инициалы
  shortName?: string;
  phone?: string;
}
