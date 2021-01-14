import { Component, Host } from '@angular/core';
import { UxgFilterDirective } from "../uxg-filter.directive";

@Component({
  selector: 'uxg-filter-button',
  templateUrl: './uxg-filter-button.component.html',
  styleUrls: ['./uxg-filter-button.component.scss']
})
export class UxgFilterButtonComponent {
  constructor(@Host() public filter: UxgFilterDirective) {}
}
