import { NgModule } from '@angular/core';
import { RequestRoutingModule } from './request-routing.module';
import { CreateRequestComponent } from "./common/components/create-request/create-request.component";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RequestViewComponent as BackofficeRequestViewComponent } from './back-office/components/request-view/request-view.component';
import { RequestListViewComponent as CustomerRequestListViewComponent } from './customer/components/request-list-view/request-list-view.component';
import { RequestListViewComponent as BackofficeRequestListViewComponent } from './back-office/components/request-list-view/request-list-view.component';
import { DocumentUploadListComponent } from './common/components/document-list/document-upload-list.component';
import { RequestViewComponent as CustomerRequestViewComponent } from './customer/components/request-view/request-view.component';
import { RequestService as BackofficeRequestService } from "./back-office/services/request.service";
import { RequestService as CustomerRequestService } from "./customer/services/request.service";
import { RequestListComponent } from "./common/components/request-list/request-list.component";

@NgModule({
  declarations: [
    RequestListComponent,
    CreateRequestComponent,
    CustomerRequestListViewComponent,
    BackofficeRequestListViewComponent,
    DocumentUploadListComponent,
    BackofficeRequestViewComponent,
    CustomerRequestViewComponent
  ],
  imports: [
    SharedModule,
    RequestRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    BackofficeRequestService,
    CustomerRequestService
  ]
})
export class RequestModule {
}
