import { DeliveryMonitorConsignment } from "./delivery-monitor-consignment";
import { DeliveryMonitorCompany } from './delivery-monitor-company';

export class InspectorInfo {
  mtrEventId: string;
  goodId: string;
  occurredAt: Date;
  type: string;
  payload: InspectorPayload;
}

export class InspectorPayload {
  certificateId?: string;
  productionOperationLinkId?: string;
}
