import { AgreementAction } from "../enum/agreement-action";

export const AgreementActionFilters: { type: AgreementAction[], label: string }[] = [
  { type: [AgreementAction.COMPLETE_REQUEST], label: "Завершить формирование заявки" },
  { type: [AgreementAction.REQUEST_AGREEMENT], label: "Согласовать заявку" }
];
