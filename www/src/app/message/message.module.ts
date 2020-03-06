import { NgModule } from '@angular/core';
import { MessagesComponent } from './messages/messages.component';
import { MessageRoutingModule } from "./message-routing.module";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MessagesViewComponent } from "./messages-view/messages-view.component";
import { MessageNotificationComponent } from './message-notification/message-notification.component';

@NgModule({
  declarations: [
    MessagesComponent,
    MessagesViewComponent,
    MessageNotificationComponent
  ],
  exports: [
    MessageNotificationComponent
  ],
  imports: [
    SharedModule,
    MessageRoutingModule,
    ReactiveFormsModule
  ]
})
export class MessageModule {
}
