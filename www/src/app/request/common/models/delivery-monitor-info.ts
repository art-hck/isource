import { ShipmentItem } from "./shipment-item";

export class DeliveryMonitorInfo {
  goodId: string;
  contractAnnexId: string;
  amountBei: number;
  dateDeliveryAnnex: Date;
  numberPlanMto: string;
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
}
