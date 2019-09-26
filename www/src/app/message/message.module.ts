import { NgModule } from '@angular/core';
import { MessagesComponent } from './messages/messages.component';
import { MessageRoutineModule } from "./message-routine.module";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MessagesViewComponent } from "./messages-view/messages-view.component";

@NgModule({
  declarations: [
    MessagesComponent,
    MessagesViewComponent
  ],
  imports: [
    SharedModule,
    MessageRoutineModule,
    ReactiveFormsModule
  ]
})
export class MessageModule { }