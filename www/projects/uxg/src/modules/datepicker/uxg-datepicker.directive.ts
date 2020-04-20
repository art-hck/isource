import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import flatpickr from "flatpickr";
import { Instance } from "flatpickr/dist/types/instance";
import { DateLimit, DateOption } from "flatpickr/dist/types/options";
import { DOCUMENT } from "@angular/common";
import { Russian } from "flatpickr/dist/l10n/ru";
import { CustomLocale, key as LocaleKey } from "flatpickr/dist/types/locale";
import { Subject } from "rxjs";
import { throttleTime } from "rxjs/operators";

@Directive({
  selector: '[uxgDatepicker]',
  exportAs: 'uxgDatepicker',
})
export class UxgDatepickerDirective implements OnInit, OnDestroy {
  @Input() dateFormat = "d.m.Y";
  @Input() disable: DateLimit<Date>[];
  @Input() enable: DateLimit<Date>[];
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
  @Input() altInput: boolean;
  @Input() altFormat: string;
  @Input() appendTo: HTMLElement;
  @Input() locale: LocaleKey | CustomLocale = Russian;
  @Input() wrap: boolean;

  flatpickr: Instance;
  open: () => void;
  close: () => void;
  readonly onScroll = new Subject();
  readonly closeOnScroll = () => this.onScroll.next();

  constructor(@Inject(DOCUMENT) private document: Document, private el: ElementRef) {}

  ngOnInit() {
    this.flatpickr = flatpickr(this.el.nativeElement, {
      ...this,
      onOpen: () => window.addEventListener('scroll', this.closeOnScroll, true),
      onClose: () => window.removeEventListener('scroll', this.closeOnScroll, true)
    });
    this.open = this.flatpickr.open;
    this.close = this.flatpickr.close;

    this.onScroll.pipe(throttleTime(100)).subscribe(() => this.flatpickr._positionCalendar());
  }

  ngOnDestroy() {
    this.flatpickr.destroy();
    this.onScroll.complete();
  }
}
