import { RequestWorkflowSteps } from "../enum/request-workflow-steps";

const labels: {[key: string]: string} = {};

labels[RequestWorkflowSteps.DRAFT] = 'Черновик';
labels[RequestWorkflowSteps.ON_CUSTOMER_APPROVAL] = 'На согласовании заказчика';
labels[RequestWorkflowSteps.NEW] = 'Новая';
labels[RequestWorkflowSteps.IN_PROGRESS] = 'В обработке';
labels[RequestWorkflowSteps.COMPLETED] = 'Выполнена';

export const RequestWorkflowStepLabels: {[key: string]: string} = labels;
