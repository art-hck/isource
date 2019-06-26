import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { RequestListComponent } from './request-list/request-list.component';
import { CreateRequestComponent } from "./common/components/create-request/create-request.component";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RequestViewComponent } from './back-office/components/request-view/request-view.component';
import { RequestService } from "./back-office/services/request.service";
import { DocumentUploadListComponent } from './common/components/document-list/document-upload-list.component';

@NgModule({
  declarations: [
    RequestListComponent,
    CreateRequestComponent,
    RequestViewComponent
    DocumentUploadListComponent
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    RequestService
  ]
})
export class RequestModule { }
