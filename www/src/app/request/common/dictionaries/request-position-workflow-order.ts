import { RequestPositionWorkflowSteps } from '../enum/request-position-workflow-steps';

const statuses = [
  RequestPositionWorkflowSteps.DRAFT.valueOf(),
  RequestPositionWorkflowSteps.ON_CUSTOMER_APPROVAL.valueOf(),
  RequestPositionWorkflowSteps.NEW.valueOf(),
  RequestPositionWorkflowSteps.PROPOSALS_PREPARATION.valueOf(),
  RequestPositionWorkflowSteps.RESULTS_AGREEMENT.valueOf(),
  RequestPositionWorkflowSteps.WINNER_SELECTED.valueOf(),
  RequestPositionWorkflowSteps.CONTRACT_AGREEMENT.valueOf(),
  RequestPositionWorkflowSteps.CONTRACT_SIGNING.valueOf(),
  RequestPositionWorkflowSteps.CONTRACTED.valueOf(),
  RequestPositionWorkflowSteps.RKD_AGREEMENT.valueOf(),
  RequestPositionWorkflowSteps.MANUFACTURING.valueOf(),
  RequestPositionWorkflowSteps.DELIVERY.valueOf(),
  RequestPositionWorkflowSteps.DELIVERED.valueOf(),
  RequestPositionWorkflowSteps.PAID.valueOf(),
  RequestPositionWorkflowSteps.COMPLETED.valueOf(),
];

export const RequestPositionWorkflowStatuses = statuses;
