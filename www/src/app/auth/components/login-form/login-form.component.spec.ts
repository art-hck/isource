
import {LoginFormComponent} from "./login-form.component";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AuthModule} from "../../auth.module";
import {AbstractControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "../../services/auth.service";
import {UserInfoService} from "../../../user/service/user-info.service";
import {By} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {throwError} from "rxjs";
import {Router} from "@angular/router";
import { of } from 'rxjs';

describe('LoginForm Component', () => {
  let router: Router,
    loginFormComponent: LoginFormComponent,
    fixture: ComponentFixture<LoginFormComponent>,
    page: Page,
    loginForm: FormGroup,
    usernameFromControl: AbstractControl,
    passwordFromControl: AbstractControl;

  beforeEach(async ( () => {
    TestBed.configureTestingModule({
      imports: [
        AuthModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
        BrowserAnimationsModule,
      FormsModule],
      providers: [
        {provide: AuthService, useClass: AuthServiceStub},
        {provide: UserInfoService, useClass: UserInfoServiceStub}]
    })
      .compileComponents()
      .then(() => {
      fixture = TestBed.createComponent(LoginFormComponent);
      loginFormComponent = fixture.componentInstance;
      router = TestBed.get(Router);

      page = new Page();
      fixture.detectChanges();
      page.addPageElements(fixture);

      loginForm = loginFormComponent.authForm;
      usernameFromControl = loginForm.controls['email'];
      passwordFromControl = loginForm.controls['password'];

    });
  }));

  it('LoginForm Component created', () => {
    expect(loginFormComponent).toBeTruthy();
  });

  it('Validation: LoginForm should be invalid in initial state', () => {
      expect(loginForm.valid).toBeFalsy();
    });

  it('Validation: LoginForm should be invalid if username is empty', () => {
    passwordFromControl.setValue('Qwerty123');
    fixture.detectChanges();
    expect(usernameFromControl.errors.required).toBeTruthy();
    expect(usernameFromControl.valid).toBeFalsy();
    expect(passwordFromControl.errors).toBeNull();
    expect(loginForm.valid).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.btn-primary').disabled).toBeTruthy();
  });

  it('Validation: LoginForm should be invalid if password is empty', () => {
    usernameFromControl.setValue('email@mail.ru');
    fixture.detectChanges();
    expect(passwordFromControl.errors.required).toBeTruthy();
    expect(passwordFromControl.valid).toBeFalsy();
    expect(usernameFromControl.errors).toBeNull();
    expect(loginForm.valid).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.btn-primary').disabled).toBeTruthy();
  });

  it('Validation: LoginForm should be invalid if username is invalid', () => {
    usernameFromControl.setValue('emailmai');
    passwordFromControl.setValue('Qwery123');
    fixture.detectChanges();
    expect(usernameFromControl.errors.invalid_email).toBeTruthy();
    expect(usernameFromControl.valid).toBeFalsy();
    expect(loginForm.valid).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.btn-primary').disabled).toBeTruthy();
  });

  it('Validation: Get error message if credentials is invalid', () => {
    let authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'login').and.returnValue(throwError('Error'));
    usernameFromControl.setValue('email@mail.ru');
    passwordFromControl.setValue('password');
    fixture.detectChanges();
    page.submitBtn.click();
    fixture.detectChanges();
    expect(page.errorPasswordMsg.textContent).toBe('Неверная эл. почта или пароль');
  });

  it('Validation: Get error message if email is invalid', () => {
    usernameFromControl.setValue('emailmai');
    usernameFromControl.markAsDirty();
    fixture.detectChanges();
    expect(page.errorUsernameMsg.textContent).toBe('Пожалуйста, проверьте корректность введённой эл. почты');
  });

  it('Validation: Get error message if email is empty', () => {
    usernameFromControl.setValue('');
    usernameFromControl.markAsDirty();
    fixture.detectChanges();
    expect(page.errorUsernameMsg.textContent).toBe('Необходимо заполнить эл. почту');
  });

  it('Validation: Get error message if password is empty', () => {
    passwordFromControl.setValue('');
    passwordFromControl.markAsDirty();
    fixture.detectChanges();
    expect(page.errorPasswordMsg.textContent).toBe('Необходимо заполнить пароль');
  });

  it('Navigation: LoginForm should navigate to Forgot Password Page when link is clicked', () => {
    spyOn(router, 'navigateByUrl');
    expect(page.forgotPasswordLink.textContent).toBe('Забыли пароль?');
    page.forgotPasswordLink.click();
    expect(router.navigateByUrl).toHaveBeenCalledWith('auth/forgot-password');
  });

  it('Navigation: LoginForm should navigate to Registration Page when link is clicked', () => {
    spyOn(router, 'navigateByUrl');
    expect(page.registrationLink.textContent).toBe('Регистрация');
    page.registrationLink.click();
    expect(router.navigateByUrl).toHaveBeenCalledWith('registration');
  });

  it('Navigation: LoginForm should navigate to / after success login', () => {
    let authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'login').and.returnValue(of('fake_token'));
    loginFormComponent.submit();
    expect(router.url).toEqual('/');
  });

  it('Navigation: LoginForm should navigate to initial url after success login', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/request');
    let authService = fixture.debugElement.injector.get(AuthService);
    spyOn(authService, 'login').and.returnValue(of('fake_token'));
    loginFormComponent.submit();
    expect(router.url).toEqual('/request');
  });
});

  class AuthServiceStub {
    login(): void {
    }
  }

  class MockRouter {
    navigateByUrl(url: string) {
      return url;
    }
  }


  class UserInfoServiceStub {
  }

  class RouterStub {
  }

class Page {
    submitBtn: HTMLElement;
    forgotPasswordLink: HTMLElement;
    registrationLink: HTMLElement;
    errorUsernameMsg: HTMLElement;
    errorPasswordMsg: HTMLElement;

  addPageElements(fixture: ComponentFixture<LoginFormComponent>) {
    let links = fixture.debugElement.queryAll(By.css('a'));
    let errorMsgs = fixture.debugElement.queryAll(By.css('.error-msg-container'));

    this.submitBtn = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;
    this.forgotPasswordLink = links[0].nativeElement;
    this.registrationLink = links[1].nativeElement;
    this.errorUsernameMsg = errorMsgs[0].nativeElement;
    this.errorPasswordMsg = errorMsgs[1].nativeElement;
  }
}
