import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestRoutingModule } from './request-routing.module';
import { RequestListComponent } from './common/components/request-list/request-list.component';
import {CreateRequestComponent} from "./common/components/create-request/create-request.component";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import { ClarityModule } from '@clr/angular';
import { RequestListViewComponent as CustomerRequestListViewComponent } from './customer/request-list-view/request-list-view.component';
import { RequestListViewComponent as BackofficeRequestListViewComponent } from './backoffice/request-list-view/request-list-view.component';


@NgModule({
  declarations: [
    RequestListComponent,
    CreateRequestComponent,
    CustomerRequestListViewComponent,
    BackofficeRequestListViewComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    RequestRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class RequestModule { }
