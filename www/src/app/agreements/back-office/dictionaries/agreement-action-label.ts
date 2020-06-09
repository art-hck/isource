import { AgreementAction } from "../enum/agreement-action";

export const AgreementActionLabel: Record<AgreementAction, string> = {
  [AgreementAction.PROCESS_REQUEST] : "Обработать заявку",
  [AgreementAction.WORK_ON_REQUEST] : "Принять в работу",
  [AgreementAction.PROVIDE_TP] : "Предоставить ТП",
  [AgreementAction.PROVIDE_CP] : "Предоставить КП",
  [AgreementAction.PROVIDE_TCP] : "Предоставить ТКП",
  [AgreementAction.CORRECT_TP] : "Скорректировать ТП",
  [AgreementAction.PROCESS_WINNER_SELECTED_CP] : "Обработать результаты выбора",
  [AgreementAction.PROCESS_WINNER_SELECTED_TCP] : "Обработать результаты выбора",
  [AgreementAction.SEND_CONTRACT_AGREEMENT] : "Направить проект договора на согласование",
  [AgreementAction.SIGN_CONTRACT] : "Подписать договор",
  [AgreementAction.CORRECT_CONTRACT] : "Скорректировать проект договора"

};
