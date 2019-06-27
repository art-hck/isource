import {Component, Input, OnInit} from '@angular/core';
import {RequestsList} from "../../models/requests-list/requests-list";
import * as moment from 'moment';
import {Router} from "@angular/router";
import {ClrDatagridFilterInterface, ClrDatagridStateInterface, ClrDatagridStringFilterInterface} from "@clr/angular";
import {RequestListItem} from "../../models/requests-list/requests-list-item";



class CustomerNameFilter implements ClrDatagridStringFilterInterface<RequestsList> {
  accepts(request: RequestsList, search: string): boolean {
    if (search.length === 0) {
      return true;
    }
    if (!request.positions || request.positions.length === 0) {
      return false;
    }
    const customer = request.customer;
    return (
      customer.name === search ||
      customer.name.toLowerCase().indexOf(search.toLowerCase()) >= 0
    );
  }
}


class RequestStatusFilter implements ClrDatagridStringFilterInterface<RequestsList> {
  accepts(request: RequestsList, search: string): boolean {
    if (search.length === 0) {
      return true;
    }
    if (!request.positions || request.positions.length === 0) {
      return false;
    }
    const requestItem = request.request;
    return (
      requestItem.status.label === search ||
      requestItem.status.label.toLowerCase().indexOf(search.toLowerCase()) >= 0
    );
  }
}


class PositionStatusFilter implements ClrDatagridStringFilterInterface<RequestsList> {
  accepts(request: RequestsList, search: string): boolean {
    if (search.length === 0) {
      return true;
    }
    if (!request.positions || request.positions.length === 0) {
      return false;
    }
    for (let index = 0; index < request.positions.length; index++) {
      const position = request.positions[index];
      if (
        position.status.label === search ||
        position.status.label.toLowerCase().indexOf(search.toLowerCase()) >= 0
      ) {
        return true;
      }
    }
    return false;
  }
}


@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})


export class RequestListComponent implements OnInit {

  private customerNameFilter = new CustomerNameFilter();
  private requestStatusFilter = new RequestStatusFilter();
  private positionStatusFilter = new PositionStatusFilter();
  statuses: RequestListItem;

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
  getDeliveryDate(request: RequestsList): string {
    if (!request.request.delivery) {
      return '—';
    } else if (request.request.delivery.asap === true) {
      return "ASAP";
    } else if (request.request.delivery.value) {
      return moment(request.request.delivery.value, "YYYY-MM-DD").locale('ru').format("D.MM.YYYY");
    } else if ((request.request.delivery.from) && (request.request.delivery.to)) {
      const dateFrom = moment(request.request.delivery.from, "YYYY-MM-DD").locale('ru').format("D.MM.YYYY");
      const dateTo = moment(request.request.delivery.to, "YYYY-MM-DD").locale('ru').format("D.MM.YYYY");
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
  getMorePositionsLabel(count: number): string {
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


  onRowClick(request: RequestsList): void {
    const role = this.customerNameColumnShow ? 'back-office' : 'customer';
    this.router.navigateByUrl(`/requests/${role}/${request.request.id}`);
  }
}
