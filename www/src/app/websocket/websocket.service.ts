import { Inject, Injectable, OnDestroy } from '@angular/core';
import { interval, Observable, Observer, Subject, SubscriptionLike } from 'rxjs';
import { distinctUntilChanged, filter, map, share, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { IWebsocketService, IWsMessage, WebSocketConfig } from './websocket.interfaces';
import { config } from './websocket.config';
import { KeycloakService } from "keycloak-angular";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements IWebsocketService, OnDestroy {

  private readonly config: WebSocketSubjectConfig<IWsMessage<any>> = {
    url: null,
    closeObserver: {
      next: () => {
        console.log('WebSocket disconnected!');
        this.websocket$ = null;
        this.connection$.next(false);
      }
    },
    openObserver: {
      next: () => {
        console.log('WebSocket connected!');
        this.connection$.next(true);
      }
    }
  };

  private reconnection$: Observable<number>;
  private websocket$: WebSocketSubject<IWsMessage<any>>;
  private connection$: Observer<boolean>;
  private wsMessages$ = new Subject<IWsMessage<any>>();
  private destroy$ = new Subject();

  // number of connection attempts
  private readonly reconnectAttempts = this.wsConfig.reconnectAttempts ?? 10;
  // pause between connections
  private reconnectInterval = this.wsConfig.reconnectInterval ?? 5000;
  private isConnected: boolean;
  public status = new Observable<boolean>(observer => this.connection$ = observer).pipe(share(), distinctUntilChanged());

  constructor(
    @Inject(config) private wsConfig: WebSocketConfig,
    private keycloakService: KeycloakService,
  ) {
    this.keycloakService.getToken().then(token => {
      // run reconnect if not connection
      this.status.pipe(takeUntil(this.destroy$)).subscribe(isConnected => {
        this.isConnected = isConnected;

        if (!this.reconnection$ && typeof (isConnected) === 'boolean' && !isConnected) {
          this.reconnect();
        }
      });

      this.wsMessages$.pipe(takeUntil(this.destroy$)).subscribe(
        () => {}, (error: ErrorEvent) => console.error('WebSocket error!', error)
      );
      this.config.url = wsConfig.url + '?access_token=' + token;
      this.connect();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
      () => {},
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
