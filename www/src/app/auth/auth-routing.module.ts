import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { PasswordRecoverModalComponent } from "./components/password-recover-modal/password-recover-modal.component";
import { CanActivateGuard } from "./can-activate.guard";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: "Страница входа" }
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    data: { title: "Регистрация" }
  },
  {
    path: 'password-recover',
    component: PasswordRecoverModalComponent,
    data: { title: "Восстановление пароля" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
