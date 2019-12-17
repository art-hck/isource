import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestListViewComponent as BackofficeRequestsList } from "./components/request-list-view/request-list-view.component";
import { RequestComponent as BackOfficeRequestComponent } from "./components/request/request.component";
import { BackOfficeRequestViewComponent } from "./components/back-office-request-view/back-office-request-view.component";
import { AddOffersComponent } from "./components/add-offers/add-offers.component";
import { AddTechnicalProposalsComponent } from "./components/add-technical-proposals/add-technical-proposals.component";

import { DesignDocumentationComponent } from "../common/components/design-documentation/design-documentation.component";
import { ContractComponent } from "../common/components/contract/contract.component";
import { RequestPositionComponent } from "./components/request-position/request-position.component";

const routes: Routes = [
  {
    path: '',
    component: BackofficeRequestsList,
    data: { title: "Заявки" }
  },
  {
    path: ':id',
    children: [
      {
        path: 'new',
        children: [
          {
            path: "",
            component: BackOfficeRequestComponent,
          },
          {
            path: ':position-id',
            component: RequestPositionComponent
          }
        ]
      },
      {
        path: '',
        component: BackOfficeRequestViewComponent,
      },
      {
        path: 'add-offers',
        component: AddOffersComponent,
        data: { title: "Коммерческие предложения" }
      },
      {
        path: 'contracts',
        component: ContractComponent,
        data: { title: "Согласование договора" }
      },
      {
        path: 'add-technical-proposals',
        component: AddTechnicalProposalsComponent,
        data: { title: "Технические предложения" }
      },
      {
        path: 'add-design-documentation',
        component: DesignDocumentationComponent,
        data: { title: "Рабочая конструкторская документация" }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestBackofficeRoutingModule {
}
