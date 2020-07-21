import { Inject, Injectable } from '@angular/core';
import { delayWhen, filter, map, take } from "rxjs/operators";
import { IWebsocketService } from "../websocket.interfaces";
import { WebSocketSubject } from "rxjs/webSocket";
import { WsChatTypes } from "../enum/ws-chat-types";
import { WsChatMessage } from "../models/ws-chat-message";
import { WsConfig } from "../models/ws-config";
import { config } from "./ws-config-token";
import { timer } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WsChatService implements IWebsocketService {
  websocket$: WebSocketSubject<WsChatMessage<unknown>>;

  constructor(@Inject(config) private wsConfig: WsConfig) {

    this.websocket$ = new WebSocketSubject<WsChatMessage<unknown>>({
      url: wsConfig.chatUrl,
      closeObserver: {
        next: () => this.websocket$ = null
      },
    });

    this.on(WsChatTypes.REJECTED).pipe(
      delayWhen<any>((v, i) => timer(i > 0 ? this.wsConfig.reconnectInterval ?? 3000 : 0)),
      take(this.wsConfig.reconnectAttempts ?? 5)
    ).subscribe(() => this.authorize("eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhVGFZcXV5R1E2ZVgxc0I1emUwQ1FGdEhqVGhmWXZraHY1UTl2LWFlM0NVIn0.eyJleHAiOjE1OTUzNTIwMTUsImlhdCI6MTU5NTM0ODQxNSwiYXV0aF90aW1lIjoxNTk1MzM5NzM0LCJqdGkiOiI5ZWY5NWFkMS0xOTEwLTRkNTItOGRkMy0zY2Q4ZDA2M2E4ZDkiLCJpc3MiOiJodHRwOi8vOTUuMjE3LjIxNS4yMDY6ODA4Mi9hdXRoL3JlYWxtcy9tYXN0ZXIiLCJzdWIiOiIxMTgwOGJjZC0zNDEwLTQyOTQtOGM2NS05ZmVkZDAwZjM4OWUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzZWN1cml0eS1hZG1pbi1jb25zb2xlIiwibm9uY2UiOiJjYWY2YmU0YS1jNTZhLTRhZDEtOTQ1Zi1hNWE3NzQyMmUwZTkiLCJzZXNzaW9uX3N0YXRlIjoiNmIxZmVkZjgtZDQzZS00MWExLTgyYmEtNWQ4MDRkMmYzOGRjIiwiYWNyIjoiMCIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vOTUuMjE3LjIxNS4yMDY6ODA4MiJdLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiJ9.GPcz7YsxSZ99cPVDjMp36RycvY_Nnrm4DMBQVgIaEVJZcoR3VGWS33_96k07C9JAA1nfqBOSwmAK-T_Wt_IRxjhQOQIxX-ASOdqeMWxVov8oNqKVNRkUC_pqDiI_V3KIg1P8qhdWo-CMyP8_ohoJxY1-zZ865Ey5hYW0os3X1XHDWS_myYhpE54nJa4ajd2Rr9eUZHd6PLK8NSR8UTZec_yh545usWBh5oLG8zG_gZHESJBq6eH_cAEd2MRYEX_xDUAXudO9avY_3fDlnBUGHmrFvPbGJ8tcqGr96S5nL-SYtp3RQ5FqjTajIMIT0ySFacyOYQrkQhrvVuNhBRXRQQ"));
  }

  on<T>(event: WsChatTypes) {
    return this.websocket$?.pipe(
      filter(({ type }) => event && type === event),
      map(({ data }: WsChatMessage<T>) => data)
    );
  }

  send<T = any>(type: WsChatTypes | string, data?: T) {
    this.websocket$.next({ type: <WsChatTypes>type, data: data ?? {} });
    return this.websocket$;
  }

  authorize(accessToken: string) {
    this.send(`authorize`, { accessToken });
  }
}
