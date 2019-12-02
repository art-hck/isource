import { NgModule } from '@angular/core';
import { ContragentRoutingModule } from './contragent-routing.module';
import { CommonModule } from '@angular/common';
import { ContragentListComponent } from './components/contragent-list/contragent-list.component';
import { SharedModule } from "../shared/shared.module";
import { ContragentListViewComponent } from "./components/contragent-list-view/contragent-list-view.component";
import { ContragentService } from "./services/contragent.service";
import { CustomerSearchFilterPipe } from "../shared/pipes/customer-list-filter-pipe";
import { ContragentInfoComponent } from './components/contragent-info/contragent-info.component';
import { ContragentInfoLinkComponent } from './components/contragent-info-link/contragent-info-link.component';
import { ContragentInfoViewComponent } from "./components/contragent-info-view/contragent-info-view.component";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ContragentRoutingModule
  ],
  declarations: [
    ContragentListViewComponent,
    ContragentListComponent,
    ContragentInfoComponent,
    ContragentInfoViewComponent,
    ContragentInfoLinkComponent,
    CustomerSearchFilterPipe,
  ],
  providers: [
    ContragentService,
  ],
  exports: [
    ContragentInfoComponent,
    ContragentInfoLinkComponent
  ]
})
export class ContragentModule { }
