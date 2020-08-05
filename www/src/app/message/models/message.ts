import { Conversation } from "./conversation";
import { Attachment } from "./attachment";
import { Author } from "./author";

export class Message {
  id: number;
  attachments: Attachment[];
  author: Author;
  conversation: Conversation;
  createdAt: string;
  seenAt: string | null;
  status: "sent" | "seen";
  text: string;
}
