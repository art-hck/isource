import { WsTypes } from "../websocket/enum/ws-types";

export enum MessageContextTypes {
  REQUEST = 'request',
  REQUEST_POSITION = 'request-position',
  REQUEST_GROUP = 'request-group',
}

export const MessageContextToEventTypesMap: Record<MessageContextTypes, WsTypes> = {
  [MessageContextTypes.REQUEST]: WsTypes.REQUEST_MESSAGE_NEW,
  [MessageContextTypes.REQUEST_GROUP]: WsTypes.REQUEST_GROUP_MESSAGE_NEW,
  [MessageContextTypes.REQUEST_POSITION]: WsTypes.REQUEST_POSITION_MESSAGE_NEW
};
