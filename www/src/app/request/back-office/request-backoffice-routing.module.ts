import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestListComponent } from "./components/request-list/request-list.component";
import { RequestComponent as BackOfficeRequestComponent } from "./components/request/request.component";

import { DesignDocumentationListComponent } from "../common/components/design-documentation-list/design-documentation-list.component";
import { ContractListComponent } from "../common/components/contract-list/contract-list.component";
import { PositionComponent } from "./components/position/position.component";
import { TechnicalProposalListComponent } from "./components/technical-proposal-list/technical-proposal-list.component";
import { CommercialProposalListComponent } from "./components/commercial-proposal-list/commercial-proposal-list.component";
import { CanActivateFeatureGuard } from "../../core/can-activate-feature.guard";
import { TechnicalCommercialProposalListComponent } from "./components/technical-commercial-proposal-list/technical-commercial-proposal-list.component";
import { RequestList2Component } from "./components/request-list2/request-list2.component";

const routes: Routes = [
  {
    path: '',
    component: RequestList2Component,
    canActivate: [CanActivateFeatureGuard],
    data: { title: "Заявки", feature: "backofficeRequest" }
  },
  {
    path: ':id',
    canActivate: [CanActivateFeatureGuard],
    data: { feature: "backofficeRequest" },
    children: [
      {
        path: '',
        component: BackOfficeRequestComponent,
      },
      {
        path: 'commercial-proposals',
        component: CommercialProposalListComponent,
        data: { title: "Коммерческие предложения" }
      },
      {
        path: 'contracts',
        component: ContractListComponent,
        data: { title: "Согласование договора" }
      },
      {
        path: 'technical-proposals',
        component: TechnicalProposalListComponent,
        data: { title: "Технические предложения" }
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
export class RequestBackofficeRoutingModule {
}
