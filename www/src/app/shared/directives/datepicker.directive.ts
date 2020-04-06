import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import flatpickr from "flatpickr";
import { Instance } from "flatpickr/dist/types/instance";
import { DateLimit, DateOption } from "flatpickr/dist/types/options";

@Directive({
  selector: '[appDatepicker]',
  exportAs: 'appDatepicker',
})
export class DatepickerDirective implements OnInit, OnDestroy {
  @Input() dateFormat: string;
  @Input() disabledDates: DateLimit<Date>[];
  @Input() enabledDates: DateLimit<Date>[];
  @Input() enableTime: boolean;
  @Input() enableSeconds: boolean;
  @Input() inline: boolean;
  @Input() maxDate: DateOption;
  @Input() maxTime: DateOption;
  @Input() minDate: DateOption;
  @Input() minTime: DateOption;
  @Input() mode: "single" | "multiple" | "range" | "time";
  @Input() monthSelectorType: "dropdown" | "static";
  @Input() time_24hr = true;
  @Input() position: "auto" | "above" | "below";
  @Input() showMonths: number;

  flatpickr: Instance;
  open: () => void;
  close: () => void;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.flatpickr = flatpickr(this.el.nativeElement, { ...this });
    this.open = this.flatpickr.open;
    this.close = this.flatpickr.close;
  }

  ngOnDestroy() {
    this.flatpickr.destroy();
  }
}
