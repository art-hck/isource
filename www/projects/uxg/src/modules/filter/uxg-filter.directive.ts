import { ContentChild, Directive } from '@angular/core';
import { UxgFilterComponent } from "./uxg-filter.component";

@Directive({
  selector: '[uxgFilter]'
})
export class UxgFilterDirective {
  @ContentChild(UxgFilterComponent) el: UxgFilterComponent;
}
