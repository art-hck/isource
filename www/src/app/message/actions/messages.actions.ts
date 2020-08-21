import { Uuid } from "../../cart/models/uuid";
import { MessageContextTypes } from "../message-context-types";
import { Message } from "../models/message";

export namespace Messages {
  // Получить список ТКП
  export class Fetch {
    static readonly type = '[Messages] Fetch';

    constructor(
      public role: string,
      public startFrom: number,
      public pageSize: number,
      public filters: string[],
      public sort: null
    ) {}
  }

  export class FetchPositions {
    static readonly type = '[Messages] FetchPositions';

    constructor(
      public requestId: Uuid,
      public role: string
    ) {}
  }

  export class FetchRequestCounters {
    static readonly type = '[Messages] FetchRequestCounters';
  }

  export class FetchConversationCounters {
    static readonly type = '[Messages] FetchConversationCounters';
  }

  export class Update {
    static readonly type = '[Messages] Update';
    constructor(
      public role: string,
      public startFrom: number,
      public pageSize: number,
      public filters: string[],
      public sort: null
    ) {}
  }

  export class CreateConversation {
    static readonly type = '[Messages] CreateConversation';
    constructor(
      public contextType: MessageContextTypes,
      public contextId: string,
      public text: string,
      public attachmentsId: number[]
    ) {}
  }

  export class Send {
    static readonly type = '[Messages] Send';
    constructor(
      public text: string,
      public conversationId: number,
      public attachmentsId: number[]
    ) {}
  }

  export class Get {
    static readonly type = '[Messages] Get';
    constructor(
      public conversationId: number
    ) {}
  }

  export class OnNew {
    static  readonly type = '[Messages] OnNew';
    constructor(public message: Message) {}
  }
}
