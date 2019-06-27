import {Component, Input, OnInit} from '@angular/core';
import {RequestsList} from "../../models/requests-list/requests-list";
import * as moment from 'moment';
import {Router} from "@angular/router";
import {ClrDatagridFilterInterface, ClrDatagridStateInterface, ClrDatagridStringFilterInterface} from "@clr/angular";
import {RequestListItem} from "../../models/requests-list/requests-list-item";
import {Subject} from "rxjs";


// class RequestStatusFilter implements ClrDatagridFilterInterface<RequestsList> {
//   changes = new Subject<any>();
//   isActive(): boolean { return true; }
//
//   accepts(request: RequestsList): boolean {
//     console.log(request);
//     return true;
//   }
//
//
//
//   // accepts(request: RequestsList, search: string): boolean {
//   //   return "" + request.request.status.label === search
//   //     || request.request.status.label.toLowerCase().indexOf(search) >= 0;
//   // }
// }


class PositionStatusFilter implements ClrDatagridStringFilterInterface<RequestsList> {
  accepts(request: RequestsList, search: string): boolean {
    console.log(request);
    console.log(search);
    return true;
  }
}


@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})


export class RequestListComponent implements OnInit {

  // private requestStatusFilter = new RequestStatusFilter();
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
    if (request.request.delivery.asap === true) {
      return "ASAP";
    } else if (request.request.delivery.value) {
      return moment(request.request.delivery.value, "YYYY-MM-DD").locale('ru').format("D MMMM YYYY");
    } else if ((request.request.delivery.from) && (request.request.delivery.to)) {
      const dateFrom = moment(request.request.delivery.from, "YYYY-MM-DD").locale('ru').format("D MMMM YYYY");
      const dateTo = moment(request.request.delivery.to, "YYYY-MM-DD").locale('ru').format("D MMMM YYYY");
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
    this.router.navigateByUrl(`/requests/${role}/${request.request.id}/view`);
  }





  refresh(state: ClrDatagridStateInterface) {

    const filters: {[prop: string]: any[]} = {};

    if (state.filters) {
      for (const filter of state.filters) {
        const {property, value} = <{property: string, value: string}>filter;
        filters[property] = [value];
        console.log(filters[property]);
      }
    }
    this.requests.filter(filters)
      .then((result: RequestsList[]) => {
        console.log(result);
        this.requests = result;
      });
  }
}
