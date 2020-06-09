import { AgreementAction } from "../enum/agreement-action";

export const AgreementActionLink: Partial<Record<AgreementAction, string>> = {
  [AgreementAction.PROVIDE_TP] : "technical-proposals",
  [AgreementAction.PROVIDE_CP] : "commercial-proposals",
  [AgreementAction.PROVIDE_TCP] : "technical-commercial-proposals",
  [AgreementAction.CORRECT_TP] : "technical-proposals",
  [AgreementAction.PROCESS_WINNER_SELECTED_CP] : "commercial-proposals",
  [AgreementAction.PROCESS_WINNER_SELECTED_TCP] : "technical-commercial-proposals",
  [AgreementAction.SEND_CONTRACT_AGREEMENT] : "contracts",
  [AgreementAction.SIGN_CONTRACT] : "contracts",
  [AgreementAction.CORRECT_CONTRACT] : "contracts"
};
