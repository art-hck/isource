import {Injectable} from "@angular/core";
import { PositionStatus as WorkflowSteps } from "../enum/position-status";

@Injectable()
export class RequestPositionStatusService {
  private statuses = Object.keys(WorkflowSteps) as WorkflowSteps[];

  isStatusAfter(status: WorkflowSteps, compare: WorkflowSteps): boolean {
    return this.statuses.indexOf(status) > this.statuses.indexOf(compare);
  }

  isStatusPrevious(status: WorkflowSteps, compare: WorkflowSteps): boolean {
    return this.statuses.indexOf(status) < this.statuses.indexOf(compare);
  }

  getPrevStatus(status: WorkflowSteps): WorkflowSteps | undefined {
    const i = this.statuses.indexOf(status);

    return this.statuses[i - 1];
  }

  getNextStatus(status: WorkflowSteps): WorkflowSteps | undefined {
    const i = this.statuses.indexOf(status);

    return this.statuses[i + 1];
  }
}
