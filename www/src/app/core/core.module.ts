import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavComponent } from './nav/nav.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { throwIfAlreadyLoaded } from "./module-import-guard";
import { CartModule } from '../cart/cart.module';
import { DataInterceptor } from "./interceptor/data.interceptor";
import { ErrorInterceptor } from "./interceptor/error.interceptor";
import { ClarityModule } from '@clr/angular';
import { FeatureService } from "./services/feature.service";
import { AuthInterceptor } from "./interceptor/auth.interceptor";
import { MessageModule } from "../message/message.module";
import { BaseUrlInterceptor } from "./interceptor/base-url-interceptor";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    CartModule,
    ClarityModule,
    MessageModule
  ],
  exports: [
    NavComponent
  ],
  declarations: [
    NavComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DataInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    FeatureService
  ],
})

export class CoreModule {
  // модуль Core должен быть загружен только один раз из модуля App
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
