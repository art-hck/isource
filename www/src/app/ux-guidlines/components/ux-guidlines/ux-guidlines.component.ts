import { Component } from '@angular/core';

import "prismjs/themes/prism.css";

@Component({
  selector: 'uxg-guidlines',
  templateUrl: 'ux-guidlines.component.html'
})

export class UxGuidlinesComponent {
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
