import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestListViewComponent as CustomerRequestsList } from "./customer/components/request-list-view/request-list-view.component";
import { RequestListViewComponent as BackofficeRequestsList } from "./back-office/components/request-list-view/request-list-view.component";
import { CreateRequestComponent } from "./common/components/create-request/create-request.component";
import { BackOfficeRequestViewComponent } from "./back-office/components/back-office-request-view/back-office-request-view.component";
import { CustomerRequestViewComponent } from "./customer/components/customer-request-view/customer-request-view.component";
import { AddOffersComponent } from "./back-office/components/add-offers/add-offers.component";
import { AddTechnicalProposalsComponent } from "./back-office/components/add-technical-proposals/add-technical-proposals.component";
import { TechnicalProposalsComponent } from "./customer/components/technical-proposals/technical-proposals.component";
import { CommercialProposalsComponent } from "./customer/components/commercial-proposals/commercial-proposals.component";
import { DesignDocumentationComponent } from "./common/components/design-documentation/design-documentation.component";
import { ContractComponent } from "./common/components/contract/contract.component";
import { RequestPositionComponent as BackOfficeRequestPositionComponent } from "./back-office/components/request-position/request-position.component";
import { RequestPositionComponent as CustomerRequestPositionComponent } from "./customer/components/request-position/request-position.component";
import { RequestComponent as BackOfficeRequestComponent } from "./back-office/components/request/request.component";
import { RequestComponent as CustomerRequestComponent} from "./customer/components/request/request.component";

const routes: Routes = [
  {
    path: 'customer',
    children: [
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
                component: CustomerRequestPositionComponent
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
    ]
  },
  {
    path: 'backoffice',
    children: [
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
                component: BackOfficeRequestPositionComponent
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
    ]
  },
  {
    path: 'create',
    component: CreateRequestComponent,
    data: { title: "Индивидуальная заявка" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {
}
