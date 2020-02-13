import { Uuid } from "../../../cart/models/uuid";
import { RequestPositionWorkflowSteps } from "../enum/request-position-workflow-steps";

export class ActivityData {
  newStatus?: RequestPositionWorkflowSteps;
  newStatusLabel?: string;
  oldStatus?: RequestPositionWorkflowSteps;
  oldStatusLabel?: string;
  newValues?: Object;
  oldValues?: Object;
  filename?: string;
  directorFullName?: string;
  positionName?: string;
  supplierId?: Uuid;
  supplierName?: string;
  offerQuantity?: number;
  offerMeasureUnit?: string;
  offerPrice?: number;
  offerCurrency?: string;
}
