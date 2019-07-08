import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClarityModule } from '@clr/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CoreModule } from "./core/core.module";
import { AccessGuard, APP_CONFIG, AuthService, AvailableGuiService } from 'stdlib-ng/dist/core';
import { PagesModule } from "./pages/pages.module";
import { StartupService } from "./startup.service";
import { StoreService as CartStoreService } from './cart/services/store.service';
import { CartModule } from './cart/cart.module';
import { AppConfig } from './config/app.config';
import { PriceListModule } from "./price-list/price-list.module";
import { CreateRequestService } from "./request/common/services/create-request.service";
import { RegistrationComponent } from './registration/components/registration.component';
import { RegistrationService } from "./registration/services/registration.service";
import { GetRequestsService } from "./request/common/services/get-requests.service";
import {RequestModule} from "./request/request.module";

export function startupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    ClarityModule,
    AppRoutingModule,
    PagesModule,
    CoreModule,
    FormsModule,
    BrowserAnimationsModule,
    CartModule,
    PriceListModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: APP_CONFIG, useValue: AppConfig},
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [StartupService, AuthService, AvailableGuiService],
      multi: true
    },
    AccessGuard,
    CreateRequestService,
    RegistrationService,
    GetRequestsService,
    CartStoreService,
    {provide: LOCALE_ID, useValue: 'ru'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
