import { Component } from '@angular/core';

@Component({
  selector: 'uxg-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  readonly menu = [
    { path: 'grid-and-typography', title: 'Grid and typography' },
    { path: 'control', title: 'Controls' },
    { path: 'button', title: 'Buttons' },
    { path: 'dropdown', title: 'Dropdowns' },
    { path: 'input', title: 'Inputs' },
    { path: 'position-status', title: 'Position status' },
    { path: 'tab', title: 'Tabs' },
    { path: 'icon', title: 'Icons' },
  ];
}
