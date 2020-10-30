import { Uuid } from "../../cart/models/uuid";

export class Notifications {
  items: NotificationItem[];
  limit: string;
  totalHits: string;
}

export class NotificationItem {
  body: NotificationInfo | string;
  channel: string;
  created_at: string;
  distribution_id: string;
  from: string;
  id: string;
  receiver: string;
  report: string;
  send_to: string;
  status: string;
  title: string;
}

export class NotificationInfo {
  type: string;
  items: NotificationPositionItem[];
  message: string;
  requestId: Uuid;
  requestName: string;
  requestNumber: string;
  requestStatus: string;
  requestStatusLabel: string;
  requestUrl: string;
  requestPositions?: NotificationPositionInfo[];
  rows?: NotificationPositionList[];
  contragentName?: string;
}

export class NotificationPositionItem {
  requestPositionId: Uuid;
  requestPositionName: string;
  requestPositionStatus: string;
  requestPositionStatusLabel: string;
}

export class NotificationPositionInfo {
  id: Uuid;
  measureUnit: string;
  name: string;
  quantity: string;
}

export class NotificationPositionList {
  items: NotificationPositionItem[];
  requestId: Uuid;
  requestName: string;
  requestNumber: string;
  requestStatus: string;
  requestStatusLabel: string;
  requestUrl: string;
}
