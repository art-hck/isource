export class UxgWizzardStep<S> {
  constructor(private step: S, private info: UxgWizzardStepInfo) {
  }

  get label(): string {
    return this.info.label;
  }

  get completed(): boolean {
    return this.info.completed === true;
  }

  get disabled(): boolean {
    return this.info.disabled;
  }

  complete(): void {
    this.info.completed = true;
  }

  reset() {
    this.info.completed = false;
  }

  disable(disabled: boolean): void {
    this.info.disabled = disabled;
  }

  toString(): S {
    return this.step;
  }
}

export class UxgWizzardStepInfo {
  label: string;
  completed?: boolean;
  disabled?: boolean;
}
