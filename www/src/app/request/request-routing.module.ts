import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestListViewComponent as CustomerRequestsList } from "./customer/components/request-list-view/request-list-view.component";
import { RequestListViewComponent as BackofficeRequestsList } from "./back-office/components/request-list-view/request-list-view.component";
import { CreateRequestComponent } from "./common/components/create-request/create-request.component";
import { BackOfficeRequestViewComponent } from "./back-office/components/back-office-request-view/back-office-request-view.component";
import { CustomerRequestViewComponent } from "./customer/components/customer-request-view/customer-request-view.component";
import { AddOffersComponent } from "./back-office/components/add-offers/add-offers.component";
import { AddTechnicalProposalsComponent } from "./back-office/components/add-technical-proposals/add-technical-proposals.component";
import {TechnicalProposalsComponent} from "./customer/components/technical-proposals/technical-proposals.component";
import { CommercialProposalsComponent } from "./customer/components/commercial-proposals/commercial-proposals.component";
import {AddDesignDocumentationComponent} from "./back-office/components/add-design-documentation/add-design-documentation.component";
import {DesignDocumentationComponent} from "./customer/components/design-documentation/design-documentation.component";

const routes: Routes = [
  {
    path: 'customer',
    children: [
      {
        path: '',
        component: CustomerRequestsList,
        data: {
          title: "Заявки"
        }
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            component: CustomerRequestViewComponent
          },
          {
            path: 'technical-proposals',
            component: TechnicalProposalsComponent
          },
          {
            path: 'commercial-proposals',
            component: CommercialProposalsComponent
          },
          {
            path: 'design-documentation',
            component: DesignDocumentationComponent
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
        component: BackofficeRequestsList
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            component: BackOfficeRequestViewComponent
          },
          {
            path: 'add-offers',
            component: AddOffersComponent
          },
          {
            path: 'add-technical-proposals',
            component: AddTechnicalProposalsComponent
          },
          {
            path: 'add-design-documentation',
            component: AddDesignDocumentationComponent
          },
        ]
      },
    ]
  },
  {
    path: 'create',
    component: CreateRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRoutingModule {
}
