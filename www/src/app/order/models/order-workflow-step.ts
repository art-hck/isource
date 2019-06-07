export class OrderWorkflowStep {
  type: string;
  label: string;

  constructor(params?: Partial<OrderWorkflowStep>) {
    Object.assign(this, params);
  }
}
