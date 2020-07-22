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
      // @TODO: реализовать авторизацию!
    ).subscribe(() => this.authorize("eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJhVGFZcXV5R1E2ZVgxc0I1emUwQ1FGdEhqVGhmWXZraHY1UTl2LWFlM0NVIn0.eyJleHAiOjE1OTU0ODEwOTksImlhdCI6MTU5NTQyMzQ5OSwianRpIjoiNGIwM2YxMTUtODdiNy00ZGRmLWFlNTktYzY0NGM5NzcxYWIwIiwiaXNzIjoiaHR0cDovLzk1LjIxNy4yMTUuMjA2OjgwODIvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjQ1MWU2MDAzLTFkY2EtNDgyZi1iOGU4LTdmZTk5MjVjMTg1NiIsInR5cCI6IkJlYXJlciIsImF6cCI6Imdwbm1hcmtldC1sb2MiLCJzZXNzaW9uX3N0YXRlIjoiNjZlZDhkMzctMmNjYy00NTM0LWIwNmYtNzI5NmU4NzcyY2VjIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJUZXN0Rmlyc3ROYW1lIFRlc3RMYXN0TmFtZSIsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIxQGNoYXRzLmV6Z2cuc2l0ZSIsImdpdmVuX25hbWUiOiJUZXN0Rmlyc3ROYW1lIiwiZmFtaWx5X25hbWUiOiJUZXN0TGFzdE5hbWUiLCJlbWFpbCI6InVzZXIxQGNoYXRzLmV6Z2cuc2l0ZSJ9.DXW_jY7bLQd8_LhBq_OLpCwLP6WsytLMcuxTSbUdunpTyjkcWonH_1DhXdw9SnJVNPZWa8OOqR4pV_fWzJBy8frb91jBuFa-KMRFn8HIxjZ9Gp5_aKQouh3f0pCKB_Bce38gXb-Jh0JfSUNvhMAkeDEn55ueewaBMADzT2yCPFuAJbTCg7_uV5d7jqabPV2ao45IQlPyGdky1NjJJv200sayXNstkNDQjIWV80Sw42-hDUj4Tte1fyQ6tGWiitU6uOBzXvIXINpV7lGoWLWhfCS8GpJaOKuvO-7KKvTcLkxMsLrxvF97allD0-s1AFnIO99PuwpB9NHW9K4LlwGbvQ"));
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
