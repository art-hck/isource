import { Component } from '@angular/core';

@Component({
  selector: 'uxg-example-controls',
  templateUrl: './uxg-example-controls.component.html'
})
export class UxgExampleControlsComponent  {
  readonly example1 = `<uxg-switcher label="Swich me"></uxg-switcher>`;
  readonly example2 = `<uxg-switcher label="Swich me" labelAlign="right"></uxg-switcher>`;
  readonly example3 = `<div class="app-row">
  <uxg-checkbox class="app-control" #controlCheckbox></uxg-checkbox>
  <label (click)="controlCheckbox.check($event)"> Check me</label>
</div>`;
}
