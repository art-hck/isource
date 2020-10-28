import { ContragentList } from "../../../contragent/models/contragent-list";

export class SupplierProposalInfo extends ContragentList {
  documents?: any;
  deliveryType?: 'INCLUDED' | 'NOT_INCLUDED' | 'PICKUP';
  deliveryAdditionalTerms?: string;
  warrantyConditions?: string;
  deliveryPrice?: number;
  deliveryCurrency?: string;
  deliveryPickup?: string;
}
