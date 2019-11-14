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
            path: '',
            component: CustomerRequestViewComponent,
            data: { title: "Заявка" }
          },
          {
            path: 'contracts',
            component: ContractComponent,
            data: { title: "На рассмотрении договора" }
          },
          {
            path: 'contract',
            component: ContractComponent,
          },
          {
            path: 'technical-proposals',
            component: TechnicalProposalsComponent,
            data: { title: "На согласовании ТП" }
          },
          {
            path: 'commercial-proposals',
            component: CommercialProposalsComponent,
            data: { title: "На согласовании КП" }
          },
          {
            path: 'design-documentation',
            component: DesignDocumentationComponent,
            data: { title: "На согласовании РКД" }
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
            path: '',
            component: BackOfficeRequestViewComponent,
            data: { title: "Заявка" }
          },
          {
            path: 'add-offers',
            component: AddOffersComponent,
            data: { title: "Коммерческие предложения" }
          },
          {
            path: 'contracts',
            component: ContractComponent,
            data: { title: "На рассмотрении договора" }
          },
          {
            path: 'add-technical-proposals',
            component: AddTechnicalProposalsComponent,
            data: { title: "На согласовании ТП" }
          },
          {
            path: 'add-design-documentation',
            component: DesignDocumentationComponent,
            data: { title: "На согласовании РКД" }
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
