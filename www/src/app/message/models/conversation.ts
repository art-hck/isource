import { User } from "../../user/models/user";

export class Conversation {
  id: number;
  topic: string;
  createdAt: string;
  participants: User[];
}
