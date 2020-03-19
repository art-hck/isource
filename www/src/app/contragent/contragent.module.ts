import { NgModule } from '@angular/core';
import { ContragentRoutingModule } from './contragent-routing.module';
import { CommonModule } from '@angular/common';
import { ContragentListComponent } from './components/contragent-list/contragent-list.component';
import { SharedModule } from "../shared/shared.module";
import { ContragentListViewComponent } from "./components/contragent-list-view/contragent-list-view.component";
import { ContragentService } from "./services/contragent.service";
import { ContragentInfoComponent } from './components/contragent-info/contragent-info.component';
import { ContragentInfoLinkComponent } from './components/contragent-info-link/contragent-info-link.component';
import { ContragentInfoViewComponent } from "./components/contragent-info-view/contragent-info-view.component";
import { ContragentRegistrationComponent } from './components/contragent-registration/contragent-registration.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDadataModule } from "@kolkov/ngx-dadata";
import {EmployeeModule} from "../employee/employee.module";

@NgModule({
  imports: [
    FormsModule,
    NgxDadataModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    ContragentRoutingModule,
    EmployeeModule
  ],
  declarations: [
    ContragentListViewComponent,
    ContragentListComponent,
    ContragentInfoComponent,
    ContragentInfoViewComponent,
    ContragentInfoLinkComponent,
    ContragentRegistrationComponent,
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
