import {Component, Input, OnInit} from '@angular/core';
import {RequestsList} from "../../models/requests-list";
import * as moment from 'moment';
import {Router} from "@angular/router";

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})


export class RequestListComponent implements OnInit {

  @Input() customerNameColumnShow = false;
  @Input() requests: RequestsList[];

  constructor(
    protected router: Router
  ) { }

  ngOnInit() {
  }

  /**
   * Функция возвращает строку с датой поставки позиций — либо ASAP, либо дата, либо диапазон дат
   *
   * @param request
   */
  getDeliveryDate(request: RequestsList) {
    if (request.request.delivery.asap === true) {
      return "ASAP";
    } else if (request.request.delivery.value) {
      return moment(request.request.delivery.value, moment.ISO_8601).locale('ru').format("D MMMM YYYY");
    } else if ((request.request.delivery.from) && (request.request.delivery.to)) {
      const dateFrom = moment(request.request.delivery.from, moment.ISO_8601).locale('ru').format("D MMMM YYYY");
      const dateTo = moment(request.request.delivery.to, moment.ISO_8601).locale('ru').format("D MMMM YYYY");
      return dateFrom + ' — ' + dateTo;
    } else {
      return '—';
    }
  }

  /**
   * Функция возвращает надпись-ссылку с количеством неперечисленных в заявке позиций
   *
   * @param count
   */
  getMorePositionsLabel(count: number) {
    const cases = [2, 0, 1, 1, 1, 2];
    const strings = ['позиция', 'позиции', 'позиций'];
    const num = count - 3;

    const positionsString = strings[
      ( num % 100 > 4 && num % 100 < 20 ) ?
      2 :
      cases[
        (num % 10 < 5) ?
        num % 10 :
        5
      ]
    ];

    return 'ещё ' + num + ' ' + positionsString + ' внутри';
  }


  onRowClick(request: RequestsList) {
    const role = this.customerNameColumnShow ? 'back-office' : 'customer';
    this.router.navigateByUrl(`/requests/${role}/${request.request.id}`);
  }
}
