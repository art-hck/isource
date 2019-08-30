import { NgModule } from '@angular/core';
import { ContragentRoutingModule } from './contragent-routing.module';
import { CommonModule } from '@angular/common';
import { ContragentListComponent } from './components/contragent-list/contragent-list.component';
import { SharedModule } from "../shared/shared.module";
import { ContragentListViewComponent } from "./components/contragent-list-view/contragent-list-view.component";
import { ContragentService } from "./services/contragent.service";

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ContragentRoutingModule
  ],
  declarations: [
    ContragentListViewComponent,
    ContragentListComponent,
  ],
  providers: [
    ContragentService,
  ],
})
export class ContragentModule { }
