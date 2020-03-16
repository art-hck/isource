import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommercialProposalsComponent } from "./components/commercial-proposal-list-old/commercial-proposals.component";
import { RequestComponent as CustomerRequestComponent } from "./components/request/request.component";
import { RequestListViewComponent as CustomerRequestsList } from "./components/request-list/request-list-view.component";
import { TechnicalProposalsComponent } from "./components/technical-proposal-list-deprecated/technical-proposals.component";
import { ContractComponent } from "../common/components/contract-list/contract.component";
import { DesignDocumentationComponent } from "../common/components/design-documentation-list/design-documentation.component";
import { RequestPositionComponent } from "./components/position/request-position.component";
import { RequestTechnicalProposalsComponent } from "./components/technical-proposal-list/request-technical-proposals.component";
import { RequestCommercialProposalsComponent } from "./components/commercial-proposal-list/request-commercial-proposals.component";
import { CanActivateFeatureGuard } from "../../core/can-activate-feature.guard";
import { RequestAgreementsComponent } from "./components/agreements/request-agreements.component";
import { CreateRequestFormComponent } from "../common/components/request-form/create-request-form.component";

const routes: Routes = [
  {
    path: '',
    component: CustomerRequestsList,
    canActivate: [CanActivateFeatureGuard],
    data: { title: "Заявки", feature: "customerRequest" },
  },
  {
    path: 'create',
    component: CreateRequestFormComponent,
    data: { title: "Создание заявки вручную", feature: "createRequest" }
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
