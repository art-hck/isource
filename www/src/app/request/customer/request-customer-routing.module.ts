import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommercialProposalListOldComponent } from "./components/commercial-proposal-list-old/commercial-proposal-list-old.component";
import { RequestComponent as CustomerRequestComponent } from "./components/request/request.component";
import { TechnicalProposalListDeprecatedComponent } from "./components/technical-proposal-list-deprecated/technical-proposal-list-deprecated.component";
import { ContractListComponent as DeprecatedContractListComponent } from "../common/components/contract-list/contract-list.component";
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
        path: 'new',
        children: [
          {
            path: 'technical-proposals',
            component: TechnicalProposalListDeprecatedComponent,
            data: { title: "Технические предложения" }
          },
          {
            path: 'commercial-proposals',
            component: CommercialProposalListOldComponent,
            data: { title: "Коммерческие предложения", noFooter: true, noContentPadding: true  }
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
        path: 'contracts-old',
        component: DeprecatedContractListComponent,
        data: { title: "На рассмотрении договора" }
      },
      {
        path: 'contract',
        component: DeprecatedContractListComponent,
        data: { title: "Согласование договора" }
      },
      {
        path: 'technical-proposals',
        component: TechnicalProposalListComponent,
        data: { title: "Технические предложения" }
      },
      {
        path: 'commercial-proposals',
        component: CommercialProposalViewComponent,
        data: { title: "Коммерческие предложения"}
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
