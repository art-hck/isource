import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from "./components/registration/registration.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { NgxDadataModule } from "@kolkov/ngx-dadata";
import { AuthRoutingModule } from "./auth-routing.module";
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ChangePasswordFormComponent } from './components/change-password-form/change-password-form.component';


@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    NgxDadataModule,
    CommonModule,
    AuthRoutingModule
  ],
  declarations: [
    RegistrationComponent,
    ForgotPasswordFormComponent,
    AuthPageComponent,
    LoginFormComponent,
    ChangePasswordFormComponent
  ]
})
export class AuthModule { }
