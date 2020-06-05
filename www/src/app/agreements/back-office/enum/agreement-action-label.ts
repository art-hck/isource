import { AgreementAction } from "./agreement-action";

export const AgreementActionLabel: Record<AgreementAction, string> = {
  [AgreementAction.PROCESS_REQUEST] : "Обработать заявку",
  [AgreementAction.WORK_ON_REQUEST] : "Принять в работу"
};
