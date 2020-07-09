import { Component, OnInit } from '@angular/core';
import { AgreementsService } from "../../../agreements/customer/services/agreements.service";
import { AgreementsResponse } from "../../../agreements/common/models/agreements-response";
import { Observable } from "rxjs";
import { NotificationService } from "../../../notification/services/notification.service";
import { NotificationsResponse } from "../../../notification/models/notifications-response";

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  agreements$: Observable<AgreementsResponse>;
  notifications$: Observable<NotificationsResponse>;

  constructor(
    private agreementsService: AgreementsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.agreements$ = this.agreementsService.getAgreements(null, 0, 5);
    this.notifications$ = this.notificationService.getDashboardNotifications();
  }
}
