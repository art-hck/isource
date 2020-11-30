import { Component, Input } from '@angular/core';
import { History } from "../../../../request/common/models/history";

@Component({
  selector: 'app-dashboard-notification',
  templateUrl: './dashboard-notification.component.html',
  styleUrls: ['./dashboard-notification.component.scss']
})
export class DashboardNotificationComponent {
  @Input() notifications: History[];
  @Input() total: number;
}
