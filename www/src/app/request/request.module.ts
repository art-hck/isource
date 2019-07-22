import { NgModule } from '@angular/core';
import { RequestRoutingModule } from './request-routing.module';
import { TextMaskModule } from 'angular2-text-mask';
import { CreateRequestComponent } from "./common/components/create-request/create-request.component";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { RequestListViewComponent as CustomerRequestListViewComponent } from './customer/components/request-list-view/request-list-view.component';
import { RequestListViewComponent as BackofficeRequestListViewComponent } from './back-office/components/request-list-view/request-list-view.component';
import { RequestService as BackofficeRequestService } from "./back-office/services/request.service";
import { RequestService as CustomerRequestService } from "./customer/services/request.service";
import { RequestListComponent } from "./common/components/request-list/request-list.component";
import { DocumentListComponent } from './common/components/document-list/document-list.component';
import { DocumentUploadListComponent } from "./common/components/document-upload-list/document-upload-list.component";
import { MessagesComponent } from './common/components/messages/messages.component';
import { CreateRequestFreeFormComponent } from './common/components/create-request-free-form/create-request-free-form.component';
import { OffersComponent as BackofficeOffersComponent } from './common/components/offers/offers.component';
import { OffersService as BackofficeOffersService} from "./back-office/services/offers.service";
import { AddFromExcelComponent } from './common/components/add-from-excel/add-from-excel.component';
import {RequestInfoComponent} from "./common/components/request-info/request-info.component";
import {PositionInfoComponent} from "./common/components/position-info/position-info.component";
import { BackOfficeRequestViewComponent } from './back-office/components/back-office-request-view/back-office-request-view.component';
import {RequestViewComponent} from "./common/components/request-view/request-view.component";
import { CustomerRequestViewComponent } from './customer/components/customer-request-view/customer-request-view.component';
import { ContractComponent } from './common/components/contract/contract.component';
import { EditPositionInfoFormComponent } from './common/components/edit-position-info-form/edit-position-info-form.component';
import { DocumentSimpleListComponent } from "./common/components/document-simple-list/document-simple-list.component";
import { CreateRequestFormComponent } from './common/components/create-request-form/create-request-form.component';


@NgModule({
  declarations: [
    RequestListComponent,
    CreateRequestComponent,
    CustomerRequestListViewComponent,
    BackofficeRequestListViewComponent,
    DocumentUploadListComponent,
    BackOfficeRequestViewComponent,
    DocumentListComponent,
    MessagesComponent,
    BackofficeOffersComponent,
    AddFromExcelComponent,
    CreateRequestFreeFormComponent,
    BackofficeOffersComponent,
    RequestInfoComponent,
    PositionInfoComponent,
    RequestViewComponent,
    CustomerRequestViewComponent,
    ContractComponent,
    DocumentSimpleListComponent,
    EditPositionInfoFormComponent,
    CreateRequestFormComponent
  ],
  imports: [
    SharedModule,
    RequestRoutingModule,
    ReactiveFormsModule,
    TextMaskModule
  ],
  providers: [
    BackofficeRequestService,
    CustomerRequestService,
    BackofficeOffersService
  ]
})
export class RequestModule {
}
