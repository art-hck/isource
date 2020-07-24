import { Inject, Injectable } from '@angular/core';
import { buffer, bufferToggle, bufferWhen, delay, delayWhen, filter, flatMap, map, mapTo, shareReplay, take, takeUntil, tap, windowToggle } from "rxjs/operators";
import { IWebsocketService } from "../websocket.interfaces";
import { WebSocketSubject } from "rxjs/webSocket";
import { WsChatTypes } from "../enum/ws-chat-types";
import { WsChatMessage } from "../models/ws-chat-message";
import { WsConfig } from "../models/ws-config";
import { config } from "./ws-config-token";
import { BehaviorSubject, from, merge, of, ReplaySubject, Subject, timer } from "rxjs";
import { MockToken } from "./mock-token";
import { KeycloakEventType, KeycloakService } from "keycloak-angular";

@Injectable({
  providedIn: 'root'
})
export class WsChatService implements IWebsocketService {
  websocket$: WebSocketSubject<WsChatMessage<unknown>>;
  authorized$ = new BehaviorSubject<boolean>(false);
  send$ = new ReplaySubject<WsChatMessage<unknown>>();
  received$ = new Subject<unknown>();

  constructor(@Inject(config) private wsConfig: WsConfig, private keycloakService: KeycloakService) {

    this.keycloakService.getToken().then(token => {
      // Как только получили токен открываем соединение ws
      this.websocket$ = new WebSocketSubject<WsChatMessage<unknown>>({
        url: wsConfig.chatUrl + '?authorization=' + MockToken,
        closeObserver: {
          next: () => this.websocket$ = null
        },
      });

      this.websocket$?.pipe(
        shareReplay(1)
      ).subscribe(data => this.received$.next(data));

      // Если приходит rejected, считаем что нужна авторизация, пробуем авторизоваться (макс 5 попыток с интервалом 3 сек)
      this.on(WsChatTypes.REJECTED).pipe(
        delayWhen<any>((v, i) => timer(i > 0 ? this.wsConfig.reconnectInterval ?? 3000 : 0)),
        take(this.wsConfig.reconnectAttempts ?? 5),
        tap(() => this.authorized$.next(false))
        // @TODO: реализовать авторизацию!
      ).subscribe(() => this.authorize(MockToken));

      // Если приходит granted, считаем что авторизованы
      this.on(WsChatTypes.GRANTED).subscribe(() => this.authorized$.next(true));

      // Все эмиты разлогина (rejected)
      const off$ = this.authorized$.pipe(filter(v => !v));
      // Все эмиты успешной авторизации (granted)
      const on$ = this.authorized$.pipe(filter(v => v));

      // Пока мы разлогинены все запросы которые мы шлём на сокеты остаются в буффере
      // Как только произойдет логин, выгружаем всё из буфера и отправляем на сервер
      merge(
        this.send$.pipe(bufferToggle(off$, () => on$)),
        this.send$.pipe(windowToggle(on$, () => off$))
      ).pipe(flatMap(x => x)).subscribe(data => this.websocket$.next(data));
    });
  }

  on<T>(event: WsChatTypes) {
    return this.received$.pipe(
      filter(({ type }) => event && type === event),
      map(({ data }: WsChatMessage<T>) => data),
    );
  }

  send<T = any, D = any>(type: WsChatTypes | string, data?: D) {
    // Не шлём запросы напрямую в websocket$.next() для буффера запросов (см. выше) которые отправились ДО овторизации
    this.send$.next({ type: <WsChatTypes>type, data: data ?? {} });

    return this.on<T>(<WsChatTypes>type);
  }

  authorize(accessToken: string) {
    this.websocket$.next({ type: WsChatTypes.AUTHORIZE, data: { accessToken } });
  }
}
