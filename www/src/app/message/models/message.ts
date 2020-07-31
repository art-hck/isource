import { User } from "../../user/models/user";
import { Conversation } from "./conversation";
import { Attachment } from "./attachment";
import { Uuid } from "../../cart/models/uuid";
import { Contragent } from "../../core/models/contragent";

export class Message {
  id: number;
  attachments: Attachment[];
  author: User;
  conversation: Conversation;
  createdAt: string;
  seenAt: string | null;
  status: "sent" | "seen";
  text: string;
}
