import { Uuid } from "../../../cart/models/uuid";
import { User } from "../../../user/models/user";
import { RequestDocument } from "./request-document";
import { Contragent } from "../../../core/models/contragent";
import { Conversation } from "../../../message/models/conversation";
import { Message } from "../../../message/models/message";
import { Attachment } from "../../../message/models/attachment";
import { Author } from "../../../message/models/author";

export class MessageNotification implements Message {
  id: number;
  author: Author;
  createdAt: string;
  text: string;
  attachments: Attachment[];
  seenAt: string | null;
  status: "sent" | "seen";
  conversation: Conversation;

  contragent?: Contragent;
  isSending?: boolean;
  contextType?: string;
  contextId?: Uuid;
  requestId?: Uuid;
}
