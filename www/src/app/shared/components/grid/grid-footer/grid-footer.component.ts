import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Subject } from "rxjs";
import { getCurrencySymbol } from "@angular/common";

@Component({
  selector: 'app-grid-footer',
  templateUrl: './grid-footer.component.html'
})
export class GridFooterComponent {
  @Input() chooseBy$: Subject<"price" | "date">;
  @Input() total: number;
  @Input() disabled: boolean;
  @Output() approve = new EventEmitter();
  @HostBinding('class.hidden') @Input() hidden: boolean;
  @HostBinding('class.proposals-footer') proposalsFooter = true;
  getCurrencySymbol = getCurrencySymbol;
}
