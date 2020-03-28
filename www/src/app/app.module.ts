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
import { RegistrationService } from "./auth/services/registration.service";
import { HttpClientModule } from "@angular/common/http";
import { NgxDadataModule } from "@kolkov/ngx-dadata";
import { WebsocketModule } from "./websocket/websocket.module";
import { UxgIconShapesSources, UxgModule } from "uxg";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ClarityIcons } from "@clr/icons";
import { AgreementsModule } from "./agreements/agreements.module";
import { MessageModule } from "./message/message.module";
import { NgxsModule } from "@ngxs/store";
import { SharedModule } from "./shared/shared.module";

export function startupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

registerLocaleData(localeRu, 'ru');
UxgIconShapesSources.forEach(icon => ClarityIcons.add(icon));

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    AgreementsModule,
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
    UxgModule,
    UserModule,
    MessageModule,
    SharedModule,
    NgxsModule.forRoot(),
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
    RegistrationService,
    CartStoreService,
    {provide: LOCALE_ID, useValue: 'ru'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
