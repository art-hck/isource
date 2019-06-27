import {RequestPositionWorkflowSteps} from "../enum/request-position-workflow-steps";

export const RequestPositionWorkflowStepLabels: {[key: string]: string} = {};

RequestPositionWorkflowStepLabels[RequestPositionWorkflowSteps.NEW] = 'Новая';
RequestPositionWorkflowStepLabels[RequestPositionWorkflowSteps.PROPOSALS_PREPARATION] = 'Подготовка предложений';
RequestPositionWorkflowStepLabels[RequestPositionWorkflowSteps.RESULTS_AGREEMENT] = 'Согласование результатов';
RequestPositionWorkflowStepLabels[RequestPositionWorkflowSteps.CONTRACT_SIGNING_BY_SUPPLIER]
  = 'Подписание договора поставщиком';
RequestPositionWorkflowStepLabels[RequestPositionWorkflowSteps.CONTRACT_SIGNING_BY_CUSTOMER]
  = 'Подписание договора заказчиком';

