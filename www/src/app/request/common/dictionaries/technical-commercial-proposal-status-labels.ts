import { TechnicalCommercialProposalStatus as Status } from "../enum/technical-commercial-proposal-status";
import { TechnicalCommercialProposalStatusLabel as Label } from "../enum/technical-commercial-proposal-status-label";

export const TechnicalCommercialProposalStatusLabels: { [key in Status]: Label } = {
  [Status.DRAFT]: Label.DRAFT,
  [Status.SENT_TO_REVIEW]: Label.SENT_TO_REVIEW,
  [Status.REVIEWED]: Label.REVIEWED,
};
