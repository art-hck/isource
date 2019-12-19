import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClarityModule } from '@clr/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from "./core/core.module";
import { AccessGuard, APP_CONFIG, AuthService, AvailableGuiService } from '@stdlib-ng/core';
import { PagesModule } from "./pages/pages.module";
import { StartupService } from "./startup.service";
import { CartStoreService as CartStoreService } from './cart/services/cart-store.service';
import { CartModule } from './cart/cart.module';
import { AppConfig } from './config/app.config';
import { CreateRequestService } from "./request/common/services/create-request.service";
import { RegistrationService } from "./auth/services/registration.service";
import { GetRequestsService } from "./request/common/services/get-requests.service";
import { EditRequestService } from "./request/common/services/edit-request.service";
import { HttpClientModule } from "@angular/common/http";
import { NgxDadataModule } from "@kolkov/ngx-dadata";
import { WebsocketModule } from "./websocket/websocket.module";
import { RequestPositionDraftService } from "./request/common/services/request-position-draft.service";
import { UxGuidlinesModule } from "./ux-guidlines/ux-guidlines.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

export function startupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    AuthModule,
    BrowserModule,
    ClarityModule,
    AppRoutingModule,
    PagesModule,
    CoreModule,
    FormsModule,
    BrowserAnimationsModule,
    CartModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDadataModule,
    UxGuidlinesModule,
    UserModule,
    WebsocketModule.config({
      url: AppConfig.endpoints.ws
    })
  ],
  providers: [
    StartupService,
    { provide: APP_CONFIG, useValue: AppConfig },
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [StartupService, AuthService, AvailableGuiService],
      multi: true
    },
    AccessGuard,
    CreateRequestService,
    EditRequestService,
    RegistrationService,
    GetRequestsService,
    CartStoreService,
    RequestPositionDraftService,
    {provide: LOCALE_ID, useValue: 'ru'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
