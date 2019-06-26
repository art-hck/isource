import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { RequestListComponent } from './request-list/request-list.component';
import {CreateRequestComponent} from "./common/components/create-request/create-request.component";
import {SharedModule} from "../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import { RequestViewComponent as BackofficeRequestViewComponent } from './back-office/components/request-view/request-view.component';
import { RequestViewComponent as CustomerRequestViewComponent } from './customer/components/request-view/request-view.component';
import {RequestService as BackofficeRequestService} from "./back-office/services/request.service";
import {RequestService as CustomerRequestService} from "./customer/services/request.service";

@NgModule({
  declarations: [
    RequestListComponent,
    CreateRequestComponent,
    BackofficeRequestViewComponent,
    CustomerRequestViewComponent

  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    BackofficeRequestService,
    CustomerRequestService

  ]
})
export class RequestModule { }
