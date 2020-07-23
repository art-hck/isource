import {Inject, Injectable} from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from "rxjs";
import { GpnmarketConfigInterface, APP_CONFIG } from "../config/gpnmarket-config.interface";
import { MockToken } from "../../websocket/services/mock-token";

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

  constructor(@Inject(APP_CONFIG) private appConfig: GpnmarketConfigInterface) {
  }

  /**
   * Добавляет хост из конфига к урлу
   *  Для подключения в требуемом модуле нужно указать внутри массива interceptors, как HTTP_INTERCEPTOR
   * @param  req
   * @param  next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.indexOf('#chat#') === 0) {
      req = req.clone({
        // @TODO: убрать когда чат будет использовать наш кейклок!
        headers: req.headers.set('Authorization', `Bearer ${MockToken}`),
        url: req.url.replace("#chat#", this.appConfig.endpoints.apiChat)
      });
      return next.handle(req);
    }

    if (req.url.indexOf('http') === 0 || req.url.indexOf('https') === 0 ) {
      return next.handle(req);
    }
    const url = this.appConfig.endpoints.api;
    req = req.clone({
      url: url + req.url
    });
    return next.handle(req);
  }
}
