import { NgModule } from '@angular/core';
import { MessageNotificationComponent } from "./message-notification/message-notification.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    MessageNotificationComponent
  ],
  exports: [
    MessageNotificationComponent
  ]
})
export class MessageSharedModule {
}
