import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommercialProposalListOldComponent } from "./components/commercial-proposal-list-old/commercial-proposal-list-old.component";
import { RequestComponent as CustomerRequestComponent } from "./components/request/request.component";
import { TechnicalProposalListDeprecatedComponent } from "./components/technical-proposal-list-deprecated/technical-proposal-list-deprecated.component";
import { ContractListComponent } from "../common/components/contract-list/contract-list.component";
import { DesignDocumentationListComponent } from "../common/components/design-documentation-list/design-documentation-list.component";
import { PositionComponent } from "./components/position/position.component";
import { TechnicalProposalListComponent } from "./components/technical-proposal-list/technical-proposal-list.component";
import { CommercialProposalListComponent } from "./components/commercial-proposal-list/commercial-proposal-list.component";
import { CanActivateFeatureGuard } from "../../core/can-activate-feature.guard";

import { RequestFormComponent } from "./components/request-form/request-form.component";
import { TechnicalCommercialProposalListComponent } from "./components/technical-commercial-proposal-list/technical-commercial-proposal-list.component";
import { RequestList2Component } from "./components/request-list2/request-list2.component";
import { Routes } from "../../core/models/routes";
import { AgreementsComponent } from "../../agreements/customer/components/agreements/agreements.component";

const routes: Routes = [
  {
    path: '',
    component: RequestList2Component,
    canActivate: [CanActivateFeatureGuard],
    data: { title: "Заявки", feature: "customerRequest" },
  },
  {
    path: 'create',
    component: RequestFormComponent,
    data: { title: "Создание заявки вручную", feature: "createRequest" }
  },
  // {
  //   path: 'agreements',
  //   component: AgreementsComponent,
  //   data: { title: "Согласования" }
  // },
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
            component: TechnicalProposalListDeprecatedComponent,
            data: { title: "Технические предложения" }
          },
          {
            path: 'commercial-proposals',
            component: CommercialProposalListComponent,
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
        component: ContractListComponent,
        data: { title: "На рассмотрении договора" }
      },
      {
        path: 'contract',
        component: ContractListComponent,
        data: { title: "Согласование договора" }
      },
      {
        path: 'technical-proposals',
        component: TechnicalProposalListComponent,
        data: { title: "Технические предложения" }
      },
      {
        path: 'commercial-proposals',
        component: CommercialProposalListOldComponent,
        data: { title: "Коммерческие предложения", noFooter: true, noContentPadding: true }
      },
      {
        path: 'technical-commercial-proposals',
        component: TechnicalCommercialProposalListComponent,
        data: { title: "Технико-коммерческие предложения" }
      },
      {
        path: 'design-documentation',
        component: DesignDocumentationListComponent,
        data: { title: "Рабочая конструкторская документация" }
      },
      {
        path: ':position-id',
        component: PositionComponent
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
