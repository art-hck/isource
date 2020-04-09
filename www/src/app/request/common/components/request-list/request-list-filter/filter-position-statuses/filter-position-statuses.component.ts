import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { AvailableFilters } from "../../../../../back-office/models/available-filters";
import { PositionStatusesLabels } from "../../../../dictionaries/position-statuses-labels";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { PositionStatusesFrequent } from "../../../../dictionaries/position-statuses-frequent";
import { PositionStatus } from "../../../../enum/position-status";

@Component({
  selector: 'app-filter-position-statuses',
  templateUrl: './filter-position-statuses.component.html',
  styleUrls: ['./filter-position-statuses.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FilterPositionStatusesComponent),
    multi: true
  }]
})
export class FilterPositionStatusesComponent implements ControlValueAccessor {

  @Input() positionsStatuses: AvailableFilters["positionStatuses"];
  isFolded = true;
  readonly PositionStatusesLabels = PositionStatusesLabels;

  value: PositionStatus[];
  onTouched: (value) => void;
  onChange: (value) => void;
  registerOnChange = fn => this.onChange = fn;
  registerOnTouched = fn => this.onTouched = fn;
  writeValue = value => this.value = value;

  get statuses() {
    return (this.positionsStatuses || [])
      .filter(item => this.isFolded ? PositionStatusesFrequent.indexOf(item.status) >= 0 : true);
  }

  check(i, checked: boolean) {
    if (checked) {
      this.writeValue([...this.value, this.statuses[i].status]);
    } else {
      this.writeValue(this.value.filter(status => status !== this.statuses[i].status));
    }

    this.onChange(this.value);
  }

  checked(i): boolean {
    return (this.value || []).indexOf(this.statuses[i].status) >= 0;
  }
}
