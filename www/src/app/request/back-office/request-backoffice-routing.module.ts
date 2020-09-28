import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestComponent as BackOfficeRequestComponent } from "./components/request/request.component";

import { DesignDocumentationListComponent } from "../common/components/design-documentation-list/design-documentation-list.component";
import { ContractListComponent as DeprecatedContractListComponent } from "../common/components/contract-list/contract-list.component";
import { PositionComponent } from "./components/position/position.component";
import { TechnicalProposalListComponent } from "./components/technical-proposal-list/technical-proposal-list.component";
import { CanActivateFeatureGuard } from "../../core/can-activate-feature.guard";
import { TechnicalCommercialProposalListComponent } from "./components/technical-commercial-proposal-list/technical-commercial-proposal-list.component";
import { RequestListComponent } from "./components/request-list/request-list.component";
import { CommercialProposalViewComponent } from "./components/commercial-proposal-view/commercial-proposal-view.component";
import { ProcedureViewComponent } from "./components/procedure-view/procedure-view.component";
import { TechnicalCommercialProposalGroupViewComponent } from "./components/technical-commercial-proposal-group-view/technical-commercial-proposal-group-view.component";
import { ContractListComponent } from "./components/contract-list/contract-list.component";

const routes: Routes = [
  {
    path: '',
    component: RequestListComponent,
    canActivate: [CanActivateFeatureGuard],
    data: { title: "Заявки", hideTitle: true, feature: "backofficeRequest" }
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
        component: CommercialProposalViewComponent,
        data: { title: "Коммерческие предложения" }
      },
      {
        path: 'contracts-new',
        component: ContractListComponent,
        data: { title: "Согласование договора" }
      },
      {
        path: 'contracts',
        component: DeprecatedContractListComponent,
        data: { title: "Согласование договора" }
      },
      {
        path: 'technical-proposals',
        component: TechnicalProposalListComponent,
        data: { title: "Технические предложения" }
      },
      {
        path: 'technical-commercial-proposals',
        component: TechnicalCommercialProposalGroupViewComponent,
        data: { title: "Технико-коммерческие предложения" },
      },
      {
        path: 'technical-commercial-proposals/:groupId',
        component: TechnicalCommercialProposalListComponent,
        data: { title: "Страница предложений" },
      },
      {
        path: 'design-documentation',
        component: DesignDocumentationListComponent,
        data: { title: "Рабочая конструкторская документация" }
      },
      {
        path: 'procedure',
        component: ProcedureViewComponent,
        data: { title: "Процедура" }
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
