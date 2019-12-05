import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { RegistrationComponent } from "./components/registration/registration.component";
import { RestorePasswordByCodeComponent } from "./components/restore-password-by-code/restore-password-by-code.component";

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
    path: 'restore-password-by-code',
    component: RestorePasswordByCodeComponent,
    data: { title: "Смена пароля" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
