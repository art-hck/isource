import { AgreementAction } from "../enum/agreement-action";

export const AgreementActionFilters: {agreementAction: AgreementAction | AgreementAction[], label: string}[] = [
{ agreementAction: AgreementAction.PROCESS_REQUEST, label: "Обработать заявку"},
  { agreementAction: AgreementAction.WORK_ON_REQUEST, label: "Принять в работу"},
  { agreementAction: AgreementAction.PROVIDE_TP, label: "Предоставить ТП"},
  { agreementAction: AgreementAction.PROVIDE_CP, label: "Предоставить КП"},
  { agreementAction: AgreementAction.PROVIDE_TCP, label: "Предоставить ТКП"},
  { agreementAction: AgreementAction.CORRECT_TP, label: "Скорректировать ТП"},
  { agreementAction: [AgreementAction.PROCESS_WINNER_SELECTED_CP, AgreementAction.PROCESS_WINNER_SELECTED_TCP], label: "Обработать результаты выбора"},
  { agreementAction: AgreementAction.SEND_CONTRACT_AGREEMENT, label: "Направить проект договора на согласование"},
  { agreementAction: AgreementAction.SIGN_CONTRACT, label: "Подписать договор"},
  { agreementAction: AgreementAction.CORRECT_CONTRACT, label: "Скорректировать проект договора"},
  { agreementAction: AgreementAction.INIT_AGREEMENT_RKD, label: "Инициировать согласование РКД"},
  { agreementAction: AgreementAction.INSPECTION_CONTROL, label: "Контроль размещения инспекции"}
];
