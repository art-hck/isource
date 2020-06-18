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
  @Input() loading: boolean;
  @Output() approve = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() sendToEdit = new EventEmitter();
  @HostBinding('class.hidden') @Input() hidden: boolean;
  @HostBinding('class.proposals-footer') proposalsFooter = true;
  getCurrencySymbol = getCurrencySymbol;
}
