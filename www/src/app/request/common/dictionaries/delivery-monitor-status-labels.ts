import { DeliveryMonitorStatus } from "../enum/delivery-monitor-status";

const labels: {[key: string]: string} = {};

labels[DeliveryMonitorStatus.PENDING] = 'Ожидает';
labels[DeliveryMonitorStatus.LOADED] = 'Отгружено';
labels[DeliveryMonitorStatus.MOVING] = 'В пути';
labels[DeliveryMonitorStatus.ARRIVED] = 'Доставлено';

export const DeliveryMonitorStatusLabels: {[key: string]: string} = labels;