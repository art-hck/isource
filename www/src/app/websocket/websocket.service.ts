import { Inject, Injectable, OnDestroy } from '@angular/core';
import { interval, Observable, Observer, Subject, SubscriptionLike } from 'rxjs';
import { distinctUntilChanged, filter, map, share, takeWhile, tap } from 'rxjs/operators';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { IWebsocketService, IWsMessage, WebSocketConfig } from './websocket.interfaces';
import { config } from './websocket.config';
import { TokenService } from "../auth/services/token.service";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements IWebsocketService, OnDestroy {

  private readonly config: WebSocketSubjectConfig<IWsMessage<any>>;

  private websocketSub: SubscriptionLike;
  private statusSub: SubscriptionLike;

  private reconnection$: Observable<number>;
  private websocket$: WebSocketSubject<IWsMessage<any>>;
  private connection$: Observer<boolean>;
  private wsMessages$: Subject<IWsMessage<any>>;

  // number of connection attempts
  private readonly reconnectAttempts: number;
  // pause between connections
  private reconnectInterval: number;
  private isConnected: boolean;

  public status: Observable<boolean>;

  constructor(
    @Inject(config) private wsConfig: WebSocketConfig,
    private token: TokenService
  ) {
    this.wsMessages$ = new Subject<IWsMessage<any>>();

    this.reconnectInterval = wsConfig.reconnectInterval || 5000;
    this.reconnectAttempts = wsConfig.reconnectAttempts || 10;

    this.config = {
      url: wsConfig.url + '?access_token=' + token.getToken(),
      closeObserver: {
        next: (event: CloseEvent) => {
          console.log('WebSocket disconnected!');
          this.websocket$ = null;
          this.connection$.next(false);
        }
      },
      openObserver: {
        next: (event: Event) => {
          console.log('WebSocket connected!');
          this.connection$.next(true);
        }
      }
    };

    // connection status
    this.status = new Observable<boolean>((observer) => {
      this.connection$ = observer;
    }).pipe(share(), distinctUntilChanged());

    // run reconnect if not connection
    this.statusSub = this.status
      .subscribe((isConnected) => {
        this.isConnected = isConnected;

        if (!this.reconnection$ && typeof (isConnected) === 'boolean' && !isConnected) {
          this.reconnect();
        }
      });

    this.websocketSub = this.wsMessages$.subscribe(
      null, (error: ErrorEvent) => console.error('WebSocket error!', error)
    );

    this.connect();
  }

  ngOnDestroy() {
    this.websocketSub.unsubscribe();
    this.statusSub.unsubscribe();
  }

  /*
  * connect to WebSocked
  * */
  private connect(): void {
    this.websocket$ = new WebSocketSubject(this.config);

    this.websocket$.subscribe(
      (message) => this.wsMessages$.next(message),
      (error: Event) => {
        if (!this.websocket$) {
          // run reconnect if errors
          this.reconnect();
        }
      });
  }

  /*
  * reconnect if not connecting or errors
  * */
  private reconnect(): void {
    this.reconnection$ = interval(this.reconnectInterval)
      .pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$));

    this.reconnection$.subscribe(
      () => this.connect(),
      null,
      () => {
        // Subject complete if reconnect attemts ending
        this.reconnection$ = null;

        if (!this.websocket$) {
          this.wsMessages$.complete();
          this.connection$.complete();
        }
      });
  }

  /*
  * on message event
  * */
  public on<T>(event: string): Observable<T> {
    console.log('[WS] Subscribe on: ' + event);
    if (event) {
      return this.wsMessages$.pipe(
        tap((message) => {
          console.log('[WS] New message: ' + message);
        }),
        filter((message: IWsMessage<T>) => message.event === event),
        map((message: IWsMessage<T>) => message.data)
      );
    }
  }

  /*
  * on message to server
  * */
  public send(event: string, data: any = {}): void {
    if (event && this.isConnected) {
      this.websocket$.next(<any>JSON.stringify({event, data}));
    } else {
      console.error('Send error!');
    }
  }
}
