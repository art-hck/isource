import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { TokenService } from "../../auth/services/token.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token: TokenService) {}

  /**
   * Добавляет в headers Authorization в случае если он есть и урл не внешний
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.token.getToken() || /^https?:\/\//.test(req.url)) {
      return next.handle(req);
    }

    const headers = req.headers.set('Authorization', `${this.token.getTokenType()} ${this.token.getToken()}`);

    return next.handle(req.clone({ headers }));
  }
}
