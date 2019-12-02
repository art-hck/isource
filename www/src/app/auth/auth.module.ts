import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from "./components/login/login.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { NgxDadataModule } from "@kolkov/ngx-dadata";
import { AuthRoutingModule } from "./auth-routing.module";
import { PasswordRecoverModalComponent } from './components/password-recover-modal/password-recover-modal.component';


@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    NgxDadataModule,
    CommonModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent,
    RegistrationComponent,
    PasswordRecoverModalComponent
  ]
})
export class AuthModule { }
