import {RequestPositionWorkflowSteps} from "../enum/request-position-workflow-steps";

const labels: {[key: string]: string} = {};

labels[RequestPositionWorkflowSteps.DRAFT] = 'Черновик';
labels[RequestPositionWorkflowSteps.ON_CUSTOMER_APPROVAL] = 'На согласовании заказчика';
labels[RequestPositionWorkflowSteps.NEW] = 'Новая';
labels[RequestPositionWorkflowSteps.PROPOSALS_PREPARATION] = 'Подготовка предложений';
labels[RequestPositionWorkflowSteps.RESULTS_AGREEMENT] = 'Согласование результатов';
labels[RequestPositionWorkflowSteps.WINNER_SELECTED] = 'Выбран победитель';
labels[RequestPositionWorkflowSteps.CONTRACT_AGREEMENT] = 'Согласование договора';
labels[RequestPositionWorkflowSteps.CONTRACT_SIGNING] = 'Подписание договора';
labels[RequestPositionWorkflowSteps.CONTRACTED] = 'Законтрактовано';
labels[RequestPositionWorkflowSteps.RKD_AGREEMENT] = 'Согласование РКД';
labels[RequestPositionWorkflowSteps.MANUFACTURING] = 'Изготовление';
labels[RequestPositionWorkflowSteps.DELIVERY] = 'Доставка';
labels[RequestPositionWorkflowSteps.DELIVERED] = 'Поставлено';
labels[RequestPositionWorkflowSteps.PAID] = 'Оплачено';
labels[RequestPositionWorkflowSteps.COMPLETED] = 'Завершено';

export const RequestPositionWorkflowStepLabels: {[key: string]: string} = labels;
