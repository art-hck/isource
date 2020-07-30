import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { MessagesViewComponent } from "./messages-view/messages-view.component";

const chatPageData = {
  title: "Сообщения",
  hideTitle: true,
  hideBreadcrumbs: true,
  noContentPadding: true,
  noFooter: true
};

const routes: Routes = [
  {
    path: '',
    component: MessagesViewComponent,
    data: chatPageData,
    children: [
      {
        path: 'request/:request-id',
        component: MessagesViewComponent,
        data: chatPageData,
        children: [
          {
            path: 'position/:position-id',
            component: MessagesViewComponent,
            data: chatPageData,
          },
          {
            path: 'group/:position-id',
            component: MessagesViewComponent,
            data: chatPageData,
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MessageRoutingModule {

}
