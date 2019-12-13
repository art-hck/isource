import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { tap } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { TokenService } from "@stdlib-ng/core";
import { Router } from "@angular/router";
import { NotificationService } from "../../shared/services/notification.service";

/**
 * Исключение для запроса с success=false
 */
export class ResponseSuccessError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  protected DEFAULT_ERROR_MSG = 'Ошибка при загрузке данных';

  constructor(
    private token: TokenService,
    private router: Router,
    private notification: NotificationService
  ) {
  }

  /**
   * Выводит пользователю ошибку, если запрос прошел не успешно и требуется показать ошибку.
   * Обрабатывает ошибки с просроченной авторизацией.
   *
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req)
      .pipe(
        tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse && 'success' in event.body && event.body.success === false) {
              this.notification.toast(event.body.message || this.DEFAULT_ERROR_MSG, 'error', 5000);
              throw new ResponseSuccessError();
            }
          },
          (err) => {
            this.handleError(err);
          }
        )
      );
  }

  protected handleError(err) {
    if (err instanceof HttpErrorResponse && (
      err.status === 401
      // костыль для хаба, потому что в некоторых случаях он возвращает 400 ошибку
      || (err.status === 400 && err.statusText === 'invalid_request')
    )) {
      this.token.signOut();

      const currentUrl = window.location.pathname;

      // если уже находимся на странице логина, то редиректа не делаем
      if (currentUrl === 'auth/login') {
        return;
      }

      const queryParams = currentUrl !== '/' ?
        { returnUrl: currentUrl } :
        {};

      // добавляем к редиректу ссылку на страницу, с которой перешли
      this.router.navigate(['auth/login'], {
        queryParams: queryParams
      });
    }

    if (err instanceof HttpErrorResponse && err.status === 422) {
      this.notification.toast(err.error.detail || this.DEFAULT_ERROR_MSG, 'error', 5000);
    }

    return throwError(err);
  }
}

