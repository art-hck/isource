import {RequestPositionWorkflowSteps} from "../enum/request-position-workflow-steps";

export const RequestPositionWorkflowStepLabels: {[key: string]: string} = {
  [RequestPositionWorkflowSteps.DRAFT]: 'Черновик',
  [RequestPositionWorkflowSteps.ON_CUSTOMER_APPROVAL]: 'На согласовании заказчика',
  [RequestPositionWorkflowSteps.NEW]: 'Новая',
  [RequestPositionWorkflowSteps.TECHNICAL_PROPOSALS_PREPARATION]: 'Подготовка ТП',
  [RequestPositionWorkflowSteps.TECHNICAL_PROPOSALS_AGREEMENT]: 'Согласование ТП',
  [RequestPositionWorkflowSteps.PROPOSALS_PREPARATION]: 'Подготовка КП',
  [RequestPositionWorkflowSteps.RESULTS_AGREEMENT]: 'Выбор победителя',
  [RequestPositionWorkflowSteps.WINNER_SELECTED]: 'Выбран победитель',
  [RequestPositionWorkflowSteps.CONTRACT_AGREEMENT]: 'Согласование договора',
  [RequestPositionWorkflowSteps.CONTRACT_SIGNING]: 'Подписание договора',
  [RequestPositionWorkflowSteps.CONTRACTED]: 'Законтрактовано',
  [RequestPositionWorkflowSteps.RKD_AGREEMENT]: 'Согласование РКД',
  [RequestPositionWorkflowSteps.MANUFACTURING]: 'Изготовление',
  [RequestPositionWorkflowSteps.DELIVERY]: 'Доставка',
  [RequestPositionWorkflowSteps.DELIVERED]: 'Поставлено',
  [RequestPositionWorkflowSteps.PAID]: 'Оплачено',
  [RequestPositionWorkflowSteps.COMPLETED]: 'Завершено',
};

