import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommercialProposalsComponent } from "./components/commercial-proposals/commercial-proposals.component";
import { CustomerRequestViewComponent } from "./components/customer-request-view/customer-request-view.component";
import { RequestComponent as CustomerRequestComponent } from "./components/request/request.component";
import { RequestListViewComponent as CustomerRequestsList } from "./components/request-list-view/request-list-view.component";
import { TechnicalProposalsComponent } from "./components/technical-proposals/technical-proposals.component";
import { ContractComponent } from "../common/components/contract/contract.component";
import { DesignDocumentationComponent } from "../common/components/design-documentation/design-documentation.component";
import { RequestPositionComponent } from "./components/request-position/request-position.component";

const routes: Routes = [
  {
    path: '',
    component: CustomerRequestsList,
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
            component: CustomerRequestComponent,
          },
          {
            path: ':position-id',
            component: RequestPositionComponent
          }
        ]
      },
      {
        path: '',
        component: CustomerRequestViewComponent,
      },
      {
        path: 'contracts',
        component: ContractComponent,
        data: { title: "На рассмотрении договора" }
      },
      {
        path: 'contract',
        component: ContractComponent,
        data: { title: "Согласование договора" }
      },
      {
        path: 'technical-proposals',
        component: TechnicalProposalsComponent,
        data: { title: "Технические предложения" }
      },
      {
        path: 'commercial-proposals',
        component: CommercialProposalsComponent,
        data: { title: "Коммерческие предложения" }
      },
      {
        path: 'design-documentation',
        component: DesignDocumentationComponent,
        data: { title: "Рабочая конструкторская документация" }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestCustomerRoutingModule {
}
