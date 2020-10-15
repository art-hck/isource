import { Component, Host } from '@angular/core';
import { FilterDirective } from "../filter.directive";

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss']
})
export class FilterButtonComponent {
  constructor(@Host() public filter: FilterDirective) {}
}
