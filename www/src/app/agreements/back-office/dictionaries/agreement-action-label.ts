import { AgreementAction } from "../enum/agreement-action";

export const AgreementActionFilters: {type: AgreementAction[], label: string}[] = [
{ type: [AgreementAction.PROCESS_REQUEST], label: "Обработать заявку"},
  { type: [AgreementAction.WORK_ON_REQUEST], label: "Принять в работу"},
  { type: [AgreementAction.PROVIDE_TP], label: "Предоставить ТП"},
  { type: [AgreementAction.PROVIDE_CP], label: "Предоставить КП"},
  { type: [AgreementAction.PROVIDE_TCP], label: "Предоставить ТКП"},
  { type: [AgreementAction.CORRECT_TP], label: "Скорректировать ТП"},
  { type: [AgreementAction.PROCESS_WINNER_SELECTED_CP, AgreementAction.PROCESS_WINNER_SELECTED_TCP], label: "Обработать результаты выбора"},
  { type: [AgreementAction.SEND_CONTRACT_AGREEMENT], label: "Направить проект договора на согласование"},
  { type: [AgreementAction.SIGN_CONTRACT], label: "Подписать договор"},
  { type: [AgreementAction.CORRECT_CONTRACT], label: "Скорректировать проект договора"},
  { type: [AgreementAction.INIT_AGREEMENT_RKD], label: "Инициировать согласование РКД"},
  { type: [AgreementAction.INSPECTION_CONTROL], label: "Контроль размещения инспекции"}
];
