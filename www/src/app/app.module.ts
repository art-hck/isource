import localeRu from '@angular/common/locales/ru';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { registerLocaleData } from '@angular/common';
import { UxgModule } from "uxg";

import { APP_CONFIG } from "./core/config/gpnmarket-config.interface";
import { AppComponent } from './app.component';
import { AppConfig } from './config/app.config';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from "./core/core.module";
import { ToastListModule } from "./shared/components/toast-list/toast-list.module";
import { WebsocketModule } from "./websocket/websocket.module";
import { SentryErrorHandler } from "./core/error-handlers/sentry.error-handler";

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    NgxsModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    ToastListModule,
    UxgModule,
    WebsocketModule.config({ url: AppConfig.endpoints.ws }),
    BrowserModule
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig },
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
