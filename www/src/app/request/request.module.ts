import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { RequestListComponent } from './request-list/request-list.component';

@NgModule({
  declarations: [RequestListComponent],
  imports: [
    CommonModule,
    RequestRoutingModule
  ]
})
export class RequestModule { }
