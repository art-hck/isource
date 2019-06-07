import {Uuid} from "../../cart/models/uuid";

export interface SupplierOffer {
  id: Uuid;
  place?: number;
  supplierName: string;
  positionsCount: number;
  deliveryCost: number;
  isMinOfferCost: boolean;
  attachedFilesCount: number;
  offerCostWithVat: number;
  offerCostWithoutVat: number;
  offerCostWithVatAndDelivery: number;
  offerCostWithoutVatAndDelivery: number;
}
