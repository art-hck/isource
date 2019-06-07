import { Component, OnInit } from '@angular/core';
import { PopularStatus } from "../../models/popular-status";

@Component({
  selector: 'app-orders-popular-statuses',
  templateUrl: './orders-popular-statuses.component.html',
  styleUrls: ['./orders-popular-statuses.component.css']
})
export class OrdersPopularStatusesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  getPopularStatuses(): PopularStatus[] {
    return [
      new PopularStatus({name: 'Все', ordersCount: 23}),
      new PopularStatus({name: 'Ожидается оплата', ordersCount: 3}),
      new PopularStatus({name: 'Просрочен', ordersCount: 8}),
      new PopularStatus({name: 'Ожидается подтверждение', ordersCount: 2}),
      new PopularStatus({name: 'На исполнении', ordersCount: 10}),
    ];
  }
}
