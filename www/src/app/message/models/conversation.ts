import { User } from "../../user/models/user";
import { Context } from "./context";

export class Conversation {
  id: number;
  topic: string;
  createdAt: string;
  participants: User[];
  context: Context;
}
