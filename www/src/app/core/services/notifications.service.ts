import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Notifications } from "../models/notifications";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class NotificationsService {

  constructor(private api: HttpClient,) {}

  getNotifications() {
      const url = `#notifications#`;
      return this.api.get<Notifications>(url, {params: {limit: '10', channel: '1'}}).pipe(map(
        notifications => {
          notifications.items = notifications.items.map(item => {
            item.body = JSON.parse(item.body as string);
            return item;
          });
          return notifications;
        }
      ));
  }
}
