import {RequestPositionWorkflowSteps} from "../enum/request-position-workflow-steps";

export const RequestPositionWorkflowStepLabels: {[key: string]: string} = {};

RequestPositionWorkflowStepLabels[RequestPositionWorkflowSteps.NEW] = 'Новая';
RequestPositionWorkflowStepLabels[RequestPositionWorkflowSteps.PROPOSALS_PREPARATION] = 'Подготовка предложений';
RequestPositionWorkflowStepLabels[RequestPositionWorkflowSteps.RESULTS_AGREEMENT] = 'Согласование результатов';
RequestPositionWorkflowStepLabels[RequestPositionWorkflowSteps.CONTRACT_SIGNING]
  = 'Заключение договора';
RequestPositionWorkflowStepLabels[RequestPositionWorkflowSteps.WINNER_SELECTED] = 'Выбран победитель';

