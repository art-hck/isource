import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'uxg-example-datepicker',
  templateUrl: './uxg-example-datepicker.html'
})
export class UxgExampleDatepickerComponent {

  readonly datepickerExampleHTML = `<uxg-datepicker uxgInput uxgDatepicker {...flatpickr options...}></uxg-datepicker>`;
  readonly datepickerExampleJS = `
    Список возможных настроек можно посмотреть здесь: https://flatpickr.js.org/options/
  `;

  public datepicker = this.getCurrentDate();

  private getCurrentDate() {
      var d = new Date(),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2)
          month = '0' + month;
      if (day.length < 2)
          day = '0' + day;

      return [day, month, year].join('.');
  }

}
