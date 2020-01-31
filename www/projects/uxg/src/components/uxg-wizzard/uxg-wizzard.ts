import { UxgWizzardStep } from "./uxg-wizzard-step";

export class UxgWizzard<S = string> implements Iterable<UxgWizzardStep<S>> {
  constructor(private steps: UxgWizzardStep<S>[], public current: S | UxgWizzardStep<S>) {
    this.current = this.current || this.steps[0];
  }

  get(step: S): UxgWizzardStep<S> {
    return this.steps.find(_step => this.equal(step, _step));
  }

  previous(): void {
    if (this.index > 0) {
      this.current = this.activeSteps[this.index - 1];
    }
  }

  next() {
    if (this.index < this.activeSteps.length) {
      this.activeSteps[this.index].complete();
      this.current = this.activeSteps[this.index + 1];
    }
  }

  reset() {
    this.current = this.activeSteps[0];
    this.steps.forEach(step => step.reset());
  }

  isCurrent(step: UxgWizzardStep<S>): boolean {
    return this.equal(this.current, step);
  }

  private get index(): number {
    return this.activeSteps.findIndex((step) => this.equal(this.current, step));
  }

  private equal(step: S | UxgWizzardStep<S>, compare: UxgWizzardStep<S>) {
    return compare === step || compare.toString() === step;
  }

  private get activeSteps() {
    return this.steps
      .filter((step) => step.disabled !== true);
  }

  * [Symbol.iterator](): Iterator<UxgWizzardStep<S>> {
    for (const step of this.activeSteps) {
      yield step;
    }
  }
}
