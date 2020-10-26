import { ContentChild, Directive } from '@angular/core';
import { FilterComponent } from "./filter.component";

@Directive({
  selector: '[appFilter]'
})
export class FilterDirective {
  @ContentChild(FilterComponent) el: FilterComponent;
}
