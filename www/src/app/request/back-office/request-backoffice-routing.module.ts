import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestListViewComponent } from "./components/request-list-view/request-list-view.component";
import { RequestComponent as BackOfficeRequestComponent } from "./components/request/request.component";
import { AddOffersComponent } from "./components/add-offers/add-offers.component";

import { DesignDocumentationComponent } from "../common/components/design-documentation/design-documentation.component";
import { ContractComponent } from "../common/components/contract/contract.component";
import { RequestPositionComponent } from "./components/request-position/request-position.component";
import { RequestTechnicalProposalsComponent } from "./components/request-technical-proposals/request-technical-proposals.component";
import { RequestCommercialProposalsComponent } from "./components/request-commercial-proposals/request-commercial-proposals.component";
import { CanActivateFeatureGuard } from "../../core/can-activate-feature.guard";

const routes: Routes = [
  {
    path: '',
    component: RequestListViewComponent,
    canActivate: [CanActivateFeatureGuard],
    data: { title: "Заявки", feature: "backofficeRequest" }
  },
  {
    path: ':id',
    canActivate: [CanActivateFeatureGuard],
    data: { feature: "backofficeRequest" },
    children: [
      {
        path: 'new',
        children: [
          {
            path: 'commercial-proposals',
            component: RequestCommercialProposalsComponent,
            data: { title: "Коммерческие предложения" }
          },
          {
            path: ':position-id',
            component: RequestPositionComponent
          }
        ]
      },
      {
        path: '',
        component: BackOfficeRequestComponent,
      },
      {
        path: 'commercial-proposals',
        component: AddOffersComponent,
        data: { title: "Коммерческие предложения" }
      },
      {
        path: 'contracts',
        component: ContractComponent,
        data: { title: "Согласование договора" }
      },
      {
        path: 'technical-proposals',
        component: RequestTechnicalProposalsComponent,
        data: { title: "Технические предложения" }
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
export class RequestBackofficeRoutingModule {
}
