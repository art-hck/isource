import { PurchaseWorkflowStepStatuses } from "../enums/purchase-workflow-step-statuses";

export const PurchaseWorkflowStepLabelsForFilter: {[key: string]: string} = {};

PurchaseWorkflowStepLabelsForFilter[PurchaseWorkflowStepStatuses.OFFERS_GATHERING] = 'Сбор цен';
PurchaseWorkflowStepLabelsForFilter[PurchaseWorkflowStepStatuses.ARCHIVE] = 'Архив';
PurchaseWorkflowStepLabelsForFilter[PurchaseWorkflowStepStatuses.PUBLISHED] = 'Опубликована';
PurchaseWorkflowStepLabelsForFilter[PurchaseWorkflowStepStatuses.PRICE_REDUCTION] = 'Снижение цены';
// с бэка возвращаем и WINNER_CHOICE и WINNER_PRICE_REDUCTION по статусу Выбор победителя
PurchaseWorkflowStepLabelsForFilter[PurchaseWorkflowStepStatuses.WINNER_CHOICE] = 'Выбор победителя';
