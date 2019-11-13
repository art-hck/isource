import { DeliveryMonitorConsignment } from "./delivery-monitor-consignment";

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
  contractAnnex: {
    consignee: {
      companyId: string,
      sapCode: string,
      name: string,
      companyType: string,
      actualAddressId?: null,
      requisites?: null,
      actualAddress?: null
    };
    consignments: DeliveryMonitorConsignment[];
  };
}
