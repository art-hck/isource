import { TechnicalCommercialProposalPositionStatus as Status} from "../enum/technical-commercial-proposal-position-status";
import { TechnicalCommercialProposalPositionStatusLabel as Label} from "../enum/technical-commercial-proposal-position-status-label";
export const TechnicalCommercialProposalPositionStatusLabels: { [key in Status]: Label } = {
  [Status.NEW]: Label.NEW,
};
