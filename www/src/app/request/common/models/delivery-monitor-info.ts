import { DeliveryMonitorConsignment } from "./delivery-monitor-consignment";
import { DeliveryMonitorCompany } from './delivery-monitor-company';

export class DeliveryMonitorInfo {
  goodId: string;
  contractAnnexId: string;
  amountBei: number;
  dateDeliveryAnnex: Date;
  numberPlanMto: string;
  inspectorStages: InspectorStage[];
  material: {
    materialId: string,
    codeMtr: string,
    mtrName: string,
    basicUnitMeasureAei: string
  };
  statusMtr: {
    awaiting: number,
    inProduction: number,
    loading: number,
    inTransit: number,
    delivered: number
  };
  contractAnnex: {
    consignee: DeliveryMonitorCompany;
    consignments: DeliveryMonitorConsignment[];
  };
}

export class InspectorStage {
  title: string;
  description: string;
  createdDate: string;
}
