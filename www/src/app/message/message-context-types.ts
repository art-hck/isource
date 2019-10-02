import { EventTypes } from "../websocket/event-types";

export enum MessageContextTypes {
  REQUEST = 'request',
  REQUEST_POSITION = 'request-position',
  REQUEST_GROUP = 'request-group',
}

export const MessageContextToEventTypesMap: { [key: string]: any } = {};

MessageContextToEventTypesMap[MessageContextTypes.REQUEST] = EventTypes.REQUEST_MESSAGE_NEW;
MessageContextToEventTypesMap[MessageContextTypes.REQUEST_GROUP] = EventTypes.REQUEST_GROUP_MESSAGE_NEW;
MessageContextToEventTypesMap[MessageContextTypes.REQUEST_POSITION] = EventTypes.REQUEST_POSITION_MESSAGE_NEW;




