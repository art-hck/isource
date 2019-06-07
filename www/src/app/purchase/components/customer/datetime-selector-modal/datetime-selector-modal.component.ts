import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import * as moment from "moment";

@Component({
  selector: 'app-datetime-selector-modal',
  templateUrl: './datetime-selector-modal.component.html',
  styleUrls: ['./datetime-selector-modal.component.css']
})

export class DatetimeSelectorModalComponent implements OnChanges {
  protected _opened = false;

  @Input()
  set opened(val) {
    this._opened = val;
    this.openedChange.emit(val);
  }
  get opened() {
    return this._opened;
  }

  @Input() label = '';
  @Input() actionButtonLabel = 'Отправить запрос';
  @Input() dateReadonly = false;
  @Output() openedChange = new EventEmitter<boolean>();
  @Output() submitAction = new EventEmitter<string>();

  validEndDate = true;
  validEndTime = true;

  requestEndDate = null;
  requestEndTime = null;

  currentDateTime = null;

  currentHours: string;
  currentMinutes: string;

  constructor() { }

  ngOnChanges() {
    this.refreshModalDateTime();
  }

  /**
   * Проверка корректности введённой даты и времени
   */
  validateDateTime(): void {
    const strict = true;

    const dateStr = this.requestEndDate;
    const hours = this.currentHours;
    const minutes = this.currentMinutes;

    const dateTime = moment(`${dateStr} ${hours}:${minutes}`, 'DD.MM.YYYY H:m', strict);

    // Две отдельные константы для даты и времени для независимой проверки каждого на корректность
    const date = moment(`${dateStr}`, 'DD.MM.YYYY', strict);
    const time = moment(`${hours}:${minutes}`, 'H:m', strict);

    const dateStart = moment().startOf('day');

    if (dateTime.isBetween(dateStart, moment())) {
      this.validEndDate = date.isValid();
      this.validEndTime = false;
    } else if (dateTime.isBefore(dateStart)) {
      this.validEndTime = time.isValid();
      this.validEndDate = false;
    } else {
      this.validEndDate = date.isValid();
      this.validEndTime = time.isValid();
    }
  }

  onActionClick(): void {
    const requestEndDate = moment(this.requestEndDate, "DD.MM.YYYY")
      .format('YYYY-MM-DD');
    const requestEndTime = moment(this.currentHours + ':' + this.currentMinutes, "H:m")
      .format('HH:mm:ss');
    this.submitAction.emit(requestEndDate + ' ' + requestEndTime);
  }

  onCloseClick(): void {
    this.opened = false;
  }

  refreshModalDateTime(): void {
    this.currentDateTime = new Date();
    this.currentDateTime.setHours(this.currentDateTime.getHours() + 3);

    this.currentHours = moment(this.currentDateTime).format('HH');
    this.currentMinutes = moment(this.currentDateTime).format('mm');

    this.requestEndDate = moment(this.currentDateTime).format('DD.MM.YYYY');
    this.requestEndTime = moment(this.currentDateTime).format('HH:mm');

    this.validEndDate = true;
    this.validEndTime = true;
  }

}
