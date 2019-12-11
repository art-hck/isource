import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { MessagesViewComponent } from "./messages-view/messages-view.component";
import { MessageService } from "./messages/message.service";

const routes: Routes = [
  {
    path: '',
    component: MessagesViewComponent,
    data: { title: "Сообщения", hideTitle: true, hideBreadcrumbs: true }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [
    MessageService
  ],
  exports: [
    RouterModule
  ]
})
export class MessageRoutingModule {

}
