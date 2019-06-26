import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestRoutingModule } from './request-routing.module';
import { RequestListComponent } from './common/components/request-list/request-list.component';
import { CreateRequestComponent } from "./common/components/create-request/create-request.component";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RequestViewComponent } from './back-office/components/request-view/request-view.component';
import { RequestService } from "./back-office/services/request.service";
import { ClarityModule } from '@clr/angular';
import { RequestListViewComponent as CustomerRequestListViewComponent } from './customer/components/request-list-view/request-list-view.component';
import { RequestListViewComponent as BackofficeRequestListViewComponent } from './back-office/components/request-list-view/request-list-view.component';
import { DocumentUploadListComponent } from './common/components/document-list/document-upload-list.component';

@NgModule({
  declarations: [
    RequestListComponent,
    CreateRequestComponent,
    RequestViewComponent,
    CreateRequestComponent,
    CustomerRequestListViewComponent,
    BackofficeRequestListViewComponent,
    RequestViewComponent,
    DocumentUploadListComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    RequestRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    RequestService
  ]
})
export class RequestModule { }
