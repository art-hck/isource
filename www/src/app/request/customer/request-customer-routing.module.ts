import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommercialProposalsComponent } from "./components/commercial-proposals/commercial-proposals.component";
import { RequestComponent as CustomerRequestComponent } from "./components/request/request.component";
import { RequestListViewComponent as CustomerRequestsList } from "./components/request-list-view/request-list-view.component";
import { TechnicalProposalsComponent } from "./components/technical-proposals/technical-proposals.component";
import { ContractComponent } from "../common/components/contract/contract.component";
import { DesignDocumentationComponent } from "../common/components/design-documentation/design-documentation.component";
import { RequestPositionComponent } from "./components/request-position/request-position.component";
import { RequestTechnicalProposalsComponent } from "./components/request-technical-proposals/request-technical-proposals.component";
import { RequestCommercialProposalsComponent } from "./components/request-commercial-proposals/request-commercial-proposals.component";
import { CanActivateFeatureGuard } from "../../core/can-activate-feature.guard";
import { RequestAgreementsComponent } from "./components/request-agreements/request-agreements.component";
import {CreateRequestComponent} from "../common/components/create-request/create-request.component";

const routes: Routes = [
  {
    path: '',
    component: CustomerRequestsList,
    canActivate: [CanActivateFeatureGuard],
    data: { title: "Заявки", feature: "customerRequest" },
  },
  {
    path: 'create',
    component: CreateRequestComponent
  },
  {
    path: 'agreements',
    component: RequestAgreementsComponent,
    data: { title: "Согласования" }
  },
  {
    path: ':id',
    canActivate: [CanActivateFeatureGuard],
    data: { feature: "customerRequest" },
    children: [
      {
        path: 'new',
        children: [
          {
            path: 'technical-proposals',
            component: RequestTechnicalProposalsComponent,
            data: { title: "Технические предложения" }
          },
          {
            path: 'commercial-proposals',
            component: RequestCommercialProposalsComponent,
            data: { title: "Коммерческие предложения" }
          },
        ]
      },
      {
        path: '',
        component: CustomerRequestComponent,
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
        data: { title: "Коммерческие предложения", noFooter: true }
      },
      {
        path: 'design-documentation',
        component: DesignDocumentationComponent,
        data: { title: "Рабочая конструкторская документация" }
      },
      {
        path: ':position-id',
        component: RequestPositionComponent
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
