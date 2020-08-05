import { User } from "../../user/models/user";
import { Conversation } from "./conversation";

export class Context {
  id: number;
  service: string;
  status: string;
  name: string;
  createdAt: string;
  supervisor: User;
  items: ContextItem[];
  conversations: Conversation[];
  unreadCount: number;
}

export class ContextItem {
  id: number;
  data: string;
}
