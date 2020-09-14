import { NgModule, Optional, SkipSelf } from '@angular/core';

import { NavComponent } from './components/nav/nav.component';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { throwIfAlreadyLoaded } from "./module-import-guard";
import { DataInterceptor } from "./interceptor/data.interceptor";
import { ErrorInterceptor } from "./interceptor/error.interceptor";
import { BaseUrlInterceptor } from "./interceptor/base-url-interceptor";
import { UxgModule } from "uxg";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { WelcomeComponent } from "../pages/welcome/welcome.component";
import { ChatSharedModule } from "../chat/chat-shared.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UxgModule,
    ChatSharedModule
  ],
  exports: [NavComponent, WelcomeComponent],
  declarations: [NavComponent, WelcomeComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DataInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
})

export class CoreModule {
  // модуль Core должен быть загружен только один раз из модуля App
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
