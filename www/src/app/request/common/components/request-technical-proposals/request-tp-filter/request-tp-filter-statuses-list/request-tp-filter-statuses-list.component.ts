import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Uuid } from "../../../../../../cart/models/uuid";
import { TechnicalProposalsStatusesLabels } from "../../../../dictionaries/technical-proposals-statuses-labels";

@Component({
  selector: 'app-request-tp-filter-statuses-list',
  templateUrl: './request-tp-filter-statuses-list.component.html',
  styleUrls: ['./request-tp-filter-statuses-list.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RequestTpFilterStatusesListComponent),
    multi: true
  }]
})
export class RequestTpFilterStatusesListComponent implements ControlValueAccessor {

  @Input() tpStatuses;

  selectedStatuses = [];

  value: Uuid[];
  onTouched: (value: Uuid[]) => void;
  onChange: (value: Uuid[]) => void;

  constructor() { }

  tpStatusLabel(status: string): string {
    return TechnicalProposalsStatusesLabels[status];
  }

  onStatusSelected(selectedStatus) {
    this.updateArray(this.selectedStatuses, selectedStatus);
    this.onChange(this.selectedStatuses);
  }

  checkIfStatusIsChecked(selectedStatus) {
    return this.selectedStatuses && this.selectedStatuses.indexOf(selectedStatus) > -1;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: Uuid[] | null): void {
    this.value = value;
  }

  protected updateArray(array: Array<Object>, item: Object): void {
    const index = array.indexOf(item);

    if (index === -1) {
      array.push(item);
    } else {
      array.splice(index, 1);
    }
  }
}
