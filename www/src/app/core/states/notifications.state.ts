import { StateStatus } from "../../request/common/models/state-status";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { patch } from "@ngxs/store/operators";
import { tap } from "rxjs/operators";
import { NotificationsActions } from "../actions/notifications.actions";
import Fetch = NotificationsActions.Fetch;
import { NotificationsService } from "../services/notifications.service";

export interface NotificationsStateModel {
  notifications: any;
  status: StateStatus;
}

type Model = NotificationsStateModel;
type Context = StateContext<Model>;

@State<Model>({
  name: 'Notifications',
  defaults: { notifications: null, status: "pristine" }
})
@Injectable()
export class NotificationsState {

  constructor(private rest: NotificationsService) {
  }

  @Selector()
  static notifications({notifications}: Model) {
    return notifications;
  }

  @Selector()
  static status({status}: Model) {
    return status;
  }

  @Action(Fetch)
  fetch(ctx: Context, action: Fetch) {
    ctx.setState(patch({ status: "fetching" } as Model));

    return this.rest.getNotifications().pipe(tap(notifications => ctx.setState(patch<Model>({
      notifications,
      status: "received"
    }))));
  }
}
