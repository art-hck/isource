import { DeliveryMonitorStatus } from "../enum/delivery-monitor-status";

export const DeliveryMonitorStatusLabels:  { [key in DeliveryMonitorStatus]: string } = {
  [DeliveryMonitorStatus.PENDING]: 'Ожидает',
  [DeliveryMonitorStatus.LOADED]: 'Отгружено',
  [DeliveryMonitorStatus.MOVING]: 'В пути',
  [DeliveryMonitorStatus.ARRIVED]: 'Доставлено'
};
