import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from "./core/core.module";
import { PagesModule } from "./pages/pages.module";
import { AppConfig } from './config/app.config';
import { HttpClientModule } from "@angular/common/http";
import { WebsocketModule } from "./websocket/websocket.module";
import { UxgIcons, UxgModule } from "uxg";
import { UserModule } from "./user/user.module";
import { ClarityIcons } from "@clr/icons";
import { AgreementsModule } from "./agreements/agreements.module";
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { APP_CONFIG } from "./core/config/gpnmarket-config.interface";
import { ToastListModule } from "./shared/components/toast-list/toast-list.module";

registerLocaleData(localeRu, 'ru');
ClarityIcons.add(UxgIcons);

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    AgreementsModule,
    PagesModule,
    CoreModule,
    UserModule,
    ToastListModule,
    UxgModule,
    NgxsModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    WebsocketModule.config({
      url: AppConfig.endpoints.ws
    })
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig },
    { provide: LOCALE_ID, useValue: 'ru' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
