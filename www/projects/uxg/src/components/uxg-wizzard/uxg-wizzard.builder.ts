import { Injectable } from '@angular/core';
import { UxgWizzardStep, UxgWizzardStepInfo } from "./uxg-wizzard-step";
import { UxgWizzard } from "./uxg-wizzard";

@Injectable({
  providedIn: 'root'
})
export class UxgWizzardBuilder {

  create<S>(stepsConfig: {[key: string]: (UxgWizzardStepInfo | string)}, current?: S): UxgWizzard<S> {
    return new UxgWizzard<S>(Object.entries(stepsConfig)
      .map(([step, info]) => new UxgWizzardStep<S>(
        step as any as S, typeof info === 'string' ? { label: info } : info
      )), current);
  }
}
