import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RequestComponent as CustomerRequestComponent } from "./components/request/request.component";
import { DesignDocumentationListComponent } from "../common/components/design-documentation-list/design-documentation-list.component";
import { PositionComponent } from "./components/position/position.component";
import { TechnicalProposalListComponent } from "./components/technical-proposal-list/technical-proposal-list.component";
import { CommercialProposalViewComponent } from "./components/commercial-proposal-view/commercial-proposal-view.component";
import { CanActivateFeatureGuard } from "../../core/can-activate-feature.guard";

import { RequestFormComponent } from "./components/request-form/request-form.component";
import { TechnicalCommercialProposalListComponent } from "./components/technical-commercial-proposal-list/technical-commercial-proposal-list.component";
import { RequestListComponent } from "./components/request-list/request-list.component";
import { Routes } from "../../core/models/routes";
import { TechnicalCommercialProposalGroupViewComponent } from "./components/technical-commercial-proposal-group-view/technical-commercial-proposal-group-view.component";
import { ContractListComponent } from "./components/contract-list/contract-list.component";
import { CommercialProposalGroupViewComponent } from "./components/commercial-proposal-group-view/commercial-proposal-group-view.component";

const routes: Routes = [
  {
    path: '',
    component: RequestListComponent,
    canActivate: [CanActivateFeatureGuard],
    data: { title: "Заявки", hideTitle: true, feature: "customerRequest" },
  },
  {
    path: 'create',
    component: RequestFormComponent,
    data: { title: "Создание заявки вручную", feature: "createRequest" }
  },
  {
    path: ':id',
    canActivate: [CanActivateFeatureGuard],
    data: { feature: "customerRequest" },
    children: [
      {
        path: '',
        component: CustomerRequestComponent,
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
        path: 'commercial-proposals',
        component: CommercialProposalGroupViewComponent,
        data: { title: "Коммерческие предложения"}
      },
      {
        path: 'commercial-proposals/:groupId',
        component: CommercialProposalViewComponent,
      },
      {
        path: 'technical-commercial-proposals',
        component: TechnicalCommercialProposalGroupViewComponent,
        data: { title: "Технико-коммерческие предложения" },
      },
      {
        path: 'technical-commercial-proposals/:groupId',
        component: TechnicalCommercialProposalListComponent,
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
