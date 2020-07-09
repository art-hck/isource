import { AgreementAction } from "../enum/agreement-action";

export const AgreementActionLink: Partial<Record<AgreementAction, string>> = {
  [AgreementAction.REVIEW_TP]: "technical-proposals",
  [AgreementAction.RESULTS_AGREEMENT_CP]: "commercial-proposals",
  [AgreementAction.RESULTS_AGREEMENT_TCP]: "technical-commercial-proposals"
};
