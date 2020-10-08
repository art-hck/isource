import { Uuid } from "../../../cart/models/uuid";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";
import { TechnicalCommercialProposalStatus } from "../enum/technical-commercial-proposal-status";
import { TechnicalCommercialProposalStatusLabel } from "../enum/technical-commercial-proposal-status-label";
import { RequestDocument } from "./request-document";
import { TechnicalCommercialProposalPosition } from "./technical-commercial-proposal-position";
import { PositionCurrency } from "../enum/position-currency";
import { CurrencyItem } from "../../../core/models/currency-item";

export class TechnicalCommercialProposal {
  id: Uuid;
  supplier: ContragentShortInfo;
  name: string;
  positions: TechnicalCommercialProposalPosition[];
  documents: RequestDocument[];
  createdDate: string;
  status: TechnicalCommercialProposalStatus;
  statusLabel: TechnicalCommercialProposalStatusLabel;
  deliveryType: 'INCLUDED' | 'NOT_INCLUDED' | 'PICKUP';
  deliveryAdditionalTerms: string;
  warrantyConditions: string;
  deliveryPrice: number;
  deliveryCurrency: string;
  deliveryPickup: string;
}
