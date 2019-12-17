import { NgModule } from '@angular/core';

import { RequestCommonModule } from "./common/request-common.module";
import { RequestBackofficeModule } from "./back-office/request-backoffice.module";
import { RequestCustomerModule } from "./customer/request-customer.module";
import { RequestRoutingModule } from "./request-routing.module";

@NgModule({
  imports: [
    RequestRoutingModule,
    RequestBackofficeModule,
    RequestCustomerModule
  ],
  exports: [
    RequestCommonModule,
    RequestBackofficeModule,
    RequestCustomerModule
  ]
})
export class RequestModule {
}
