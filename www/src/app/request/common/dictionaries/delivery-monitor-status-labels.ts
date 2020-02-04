import { DeliveryMonitorStatus } from "../enum/delivery-monitor-status";

export const DeliveryMonitorStatusLabels: { [key: string]: string } = {
  [DeliveryMonitorStatus.PENDING]: 'Ожидает',
  [DeliveryMonitorStatus.LOADED]: 'Отгружено',
  [DeliveryMonitorStatus.MOVING]: 'В пути',
  [DeliveryMonitorStatus.ARRIVED]: 'Доставлено'
};
