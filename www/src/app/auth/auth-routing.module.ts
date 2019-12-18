import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from "./components/registration/registration.component";
import { AuthPageComponent } from "./components/auth-page/auth-page.component";
import { ForgotPasswordFormComponent } from "./components/forgot-password-form/forgot-password-form.component";
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { ChangePasswordFormComponent } from "./components/change-password-form/change-password-form.component";
import { ActivationFormComponent } from "./components/activation-form/activation-form.component";

const routes: Routes = [
  {
    path: 'auth',
    component: AuthPageComponent,
    data: { title: "Страница входа" },
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginFormComponent,
        data: { title: "Авторизация" }
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordFormComponent,
        data: { title: "Восстановление пароля" }
      },
      {
        path: 'change-password',
        component: ChangePasswordFormComponent,
        data: { title: "Смена пароля" }
      }
    ]
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    data: { title: "Регистрация" }
  },
  {
    path: 'activate',
    component: ActivationFormComponent,
    data: { title: "Активация аккаунта" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
