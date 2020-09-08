import { NgModule } from '@angular/core';
import { MessagesComponent } from './messages/messages.component';
import { MessageRoutingModule } from "./message-routing.module";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MessagesViewComponent } from "./messages-view/messages-view.component";
import { MessageSharedModule } from "./message-shared.module";
import { NgxsModule } from "@ngxs/store";
import { MessagesState } from "./states/messages.state";

@NgModule({
  declarations: [
    MessagesComponent,
    MessagesViewComponent
  ],
  imports: [
    SharedModule,
    MessageSharedModule,
    MessageRoutingModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([
      MessagesState
    ])
  ]
})
export class MessageModule {
}
