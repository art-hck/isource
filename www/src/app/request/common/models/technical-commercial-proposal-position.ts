import { Uuid } from "../../../cart/models/uuid";
import { ContragentShortInfo } from "../../../contragent/models/contragent-short-info";
import { TechnicalCommercialProposalStatus } from "../enum/technical-commercial-proposal-status";
import { TechnicalCommercialProposalStatusLabel } from "../enum/technical-commercial-proposal-status-label";
import { RequestDocument } from "./request-document";
import { RequestPosition } from "./request-position";
import { PositionCurrency } from "../enum/position-currency";
import { TechnicalCommercialProposalPositionStatus } from "../enum/technical-commercial-proposal-position-status";
import { TechnicalCommercialProposalPositionStatusLabel } from "../enum/technical-commercial-proposal-position-status-label";

export class TechnicalCommercialProposalPosition {
    id: Uuid;
    proposalId: Uuid;
    manufacturingName: string;
    priceWithVat: number;
    priceWithoutVat: number;
    vatPercent: number | null;
    currency: PositionCurrency | null;
    quantity: number;
    measureUnit: string;
    deliveryDate: string | null;
    status: TechnicalCommercialProposalPositionStatus;
    statusLabel: TechnicalCommercialProposalPositionStatusLabel;
    position: RequestPosition;
    paymentTerms: string;
}
