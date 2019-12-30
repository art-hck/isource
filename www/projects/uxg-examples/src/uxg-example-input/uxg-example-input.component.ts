import { Component } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";

@Component({
  selector: 'uxg-example-input',
  templateUrl: './uxg-example-input.component.html'
})
export class UxgExampleInputComponent {
  readonly example = `<form [formGroup]="form" (ngSubmit)="submit(form)">
  <div class="app-control-error" *ngIf="form.errors as e">
    <span *ngIf="e.invalid">Неверные имя пользователя или пароль.</span>
  </div>

  <input uxgInput type="text" lg formControlName="user" placeholder="Почта"/>
  <div class="app-control-error" *ngIf="form.get('user').errors as e">
    <span *ngIf="e.required">Обязательное поле</span>
    <span *ngIf="e.minlength as e">Минимальная длина {{e.requiredLength}}, а сейчас {{e.actualLength}}</span>
    <span *ngIf="e.email">Неверная почта</span>
  </div>

  <input uxgInput type="text" lg formControlName="password" placeholder="Пароль"/>
  <div class="app-control-error" *ngIf="form.get('password').errors as e">
    <span *ngIf="e.required">Обязательное поле</span>
    <span *ngIf="e.minlength as e">Минимальная длина {{e.requiredLength}}, а сейчас {{e.actualLength}}</span>
    <span *ngIf="e.pattern">Заглавные и строчные буквы и цифры.</span>
  </div>

  <div class="app-row clr-align-items-center">
    <uxg-switcher label="Запомнить меня" labelAlign="right" formControlName="rememberMe"></uxg-switcher>
    <div class="app-btn-group">
      <button uxgButton outline lg icon type="button" (click)="form.reset()">
        <clr-icon shape="refresh" flip="horizontal" class="is-solid"></clr-icon>
      </button>
      <button uxgButton primary lg iconText [disabled]="form.invalid">
        <clr-icon shape="login" class="is-solid"></clr-icon>
        <span>Войти</span>
      </button>
    </div>
  </div>
</form>`;

  form = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])[\S]*$/)
    ]),
    rememberMe: new FormControl()
  });

  errorsCount(errors: ValidationErrors): number {
    return Object.keys(errors).length;
  }

  submit(form) {
    form.setErrors({invalid : true});
  }
}
